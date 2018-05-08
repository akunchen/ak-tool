<template>
    <div>
        <el-row>
            <el-button type="primary" @click="showUploadImageForm=true">新建</el-button>
        </el-row>
        <hr>

        <!-- 图片列表 -->
        <el-table :data="images" style="width: 100%" class="table table-striped table-bordered">
            <el-table-column type="index" label="#"/>
            <el-table-column prop="name" label="名称"/>
            <el-table-column prop="desc" label="描述"/>
            <el-table-column prop="hash" label="图片">
                <template slot-scope="scope">
                    <img style="cursor: pointer" title="点击查看大图" :src="scope.row.getUrl() + `?imageView2/1/w/100`"
                         @click="viewBigImage(scope.row)">
                </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间" :formatter="formatTime"/>
            <el-table-column prop="createdAt" label="更新时间" :formatter="formatTime"/>
            <el-table-column label="操作" prop="id">
                <template slot-scope="scope">
                    <p>
                        <el-button type="default" size="mini" @click="viewBigImage(scope.row)">查看大图</el-button>
                        <el-button type="default" size="mini" @click="modifyImage(scope.row)">修改</el-button>
                    </p>
                    <p>
                        <el-button type="default" size="mini" @click="copyLink(scope.row)">复制链接</el-button>
                        <el-button type="danger" size="mini" @click="removeImage(scope.row)">删除</el-button>
                    </p>
                </template>
            </el-table-column>
        </el-table>

        <el-row class="text-right">
            <el-pagination @size-change="handleSizeChange"
                           @current-change="currentPageChange"
                           :current-page="currentPage"
                           :page-sizes="[10,50,100, 200, 300, 400]"
                           :page-size="pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="imageTotal">
            </el-pagination>
        </el-row>

        <!-- 上传图片 -->
        <el-dialog title="上传图片" :close-on-click-modal="true" :visible.sync="showUploadImageForm">
            <el-upload ref="uploadImageFile"
                       :action="uploadImagePath"
                       :data="uploadImageData"
                       :on-success="uploadImageSuccess"
                       :on-error="uploadImageError"
                       :multiple="true"
                       list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
        </el-dialog>

        <!-- 修改图片 -->
        <el-dialog title="编辑图片描述" :close-on-click-modal="true" :visible.sync="showEditImageForm">
            <el-form :model="editImage" ref="editImageForm" :rules="editImageFormRules" label-width="90px">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="editImage.name"/>
                </el-form-item>
                <el-form-item label="描述" prop="desc">
                    <el-input v-model="editImage.desc"/>
                </el-form-item>
                <el-form-item label="图片" prop="hash">
                    <img style="cursor: pointer" title="点击查看大图" :src="editImage.getUrl() + `?imageView2/1/w/100`"
                         @click="viewBigImage(editImage)" v-if="editImage && editImage.getUrl()">
                </el-form-item>
            </el-form>
            <el-row class="text-right">
                <el-button type="primary" @click="editImageFormSave">保存</el-button>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
  import { clipboard } from 'electron'
  import { qiniuHelper } from '../../util/Qiniu'
  import { Image } from '../../models'
  import { singleParse } from '../../util'

  export default {
    name: 'images',
    data () {
      return {
        // 分页参数
        pageSize: 10,
        currentPage: 1,
        imageTotal: 0,
        // 列表部分
        images: [],
        baseHost: '',

        // 上传表单部分
        showUploadImageForm: false,
        uploadImagePath: 'http://up-z2.qiniu.com/',
        uploadImageData: {
          token: null
        },

        // 修改图片内容表单
        showEditImageForm: false,
        editImage: new Image(),
        editImageFormRules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'},
          ],
        }
      }
    },
    async mounted () {
      this.getImages()
      await qiniuHelper.getBucket()
      this.uploadImageData.token = qiniuHelper.getUploadToken()
    },
    methods: {
      /**
       * 文件上传失败
       * @param err
       * @param file
       * @param fileList
       */
      uploadImageError (err, file, fileList) {
        alert('上传图片失败：' + JSON.stringify(err))
      },
      /**
       * 文件上传成功
       * @param response
       * @param file
       * @param fileList
       */
      async uploadImageSuccess (response, file, fileList) {
        let image = await Image.findOne({where: {hash: file.response.hash}})
        if (!image) {
          image = new Image()
        }

        image.name = file.name.split('.')[0]
        image.hash = file.response.hash
        await image.save()

        this.getImages()
      },
      /**
       * 获取图片
       * @return {Promise<void>}
       */
      async getImages () {
        this.images = await Image.findAll({
          order: [['updatedAt', 'desc']],
          offset: (this.currentPage - 1) * this.pageSize,
          limit: this.pageSize
        })

        this.imageTotal = await Image.count()
      },
      /**
       * 查看大图
       * @param image
       */
      viewBigImage (image) {
        open(image.getUrl())
      },
      /**
       * 格式化时间
       * @param image
       * @param column
       * @param {Date} time 时间
       * @param index
       */
      formatTime (image, column, time, index) {
        return time.format('yyyy-MM-dd hh:mm:ss')
      },
      /**
       * 修改图片描述
       * @param image
       */
      modifyImage (image) {
        this.showEditImageForm = true
        this.editImage = image
      },
      /**
       * 保存图片修改
       * @return {Promise<void>}
       */
      async editImageFormSave () {
        if (!await singleParse(this.$refs.editImageForm.validate)) {//检验不通过
          return false
        }

        await this.editImage.save()
        this.showEditImageForm = false
        this.getImages()
      },
      /**
       * 删除图片
       * @param image
       */
      async removeImage (image) {
        const r = await this.$confirm('确认删除该文件', '提示').catch(e => false)
        if (r !== 'confirm') {
          return false
        }

        await qiniuHelper.removeFile(image.hash)
        await image.destroy()
        new Notification('删除成功')
        this.getImages()
      },
      /**
       * 切换页码
       * @param pageSize
       */
      handleSizeChange (pageSize) {
        this.pageSize = pageSize
        this.currentPage = 1
        this.getImages()
      },
      /**
       * 页码变化
       * @param {Number} currentPage
       */
      currentPageChange (currentPage) {
        this.currentPage = currentPage
        this.getImages()
      },
      /**
       * 复制链接
       * @param {Image} image
       */
      copyLink (image) {
        clipboard.writeText(image.getUrl())
        new Notification('复制成功')
      }
    }
  }
</script>

<style scoped>

</style>