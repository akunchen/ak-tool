<template>
    <div>
        <div class="form-group">
            <label class="control-label" for="databasetableschemaform-tablename">Table Name</label>
            <select id="databasetableschemaform-tablename" class="form-control"
                    name="DatabaseTableSchemaForm[tableName]" aria-required="true" aria-invalid="false">
                <optgroup :label="index" v-for="(table,index) in tables">
                    <option :value="table.name" v-text="table.name"></option>
                </optgroup>
            </select>

            <p class="help-block help-block-error"></p>
        </div>
    </div>
</template>

<script>
  import Database from '../../models/Database'

  export default {
    name: 'tables',
    data () {
      return {
        tables: [],
        selectTable: {},
        database: null
      }
    },
    async mounted () {
      this.database = await Database.findById(this.$route.params.id)
      this.getTables()
    },
    methods: {
      async getTables () {
        let schemas = await this.database.getConnection().showAllSchemas()
        this.tables = schemas.map(schema => {
          return {
            name: Object.values(schema).shift()
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>