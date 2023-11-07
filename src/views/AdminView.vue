<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" />
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-s-home"
        @click="handleReturn">
        Return to Home
      </el-button>
    </div>

    <p />

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="ID" prop="id" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="City" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Country" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.country }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Description" width="400px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Longitude" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.lon }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Latitude" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.lat }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Actions" align="center" width="300px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" v-loading="dialogLoading" :rules="rules" :model="currCity" label-position="left"
        label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="City" prop="name">
          <el-input v-model="currCity.name" :disabled="formItemDisable" />
        </el-form-item>
        <el-form-item label="Country" prop="country">
          <el-input v-model="currCity.country" :disabled="formItemDisable" />
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input v-model="currCity.description" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('dataForm')">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="Confirm Delete" :visible.sync="deleteDialogVisible" width="30%" :before-close="handleClose">
      <span><b>Are you sure to delete the city?</b></span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="deleteData(row)">Confirm</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getAllCity, createCity, deleteCity, editCity } from '@/api/HttpRequest'

export default {
  name: 'Admin Page',
  data() {
    return {
      list: null,
      listLoading: true,
      textMap: {
        update: 'Edit City',
        create: 'Create City'
      },
      currCity: {
        id: undefined,
        name: '',
        country: '',
        description: '',
      },
      rules: {
        name: [{ required: true, message: 'City is required', trigger: 'blur' }],
        description: [{ required: true, message: 'Description is required', trigger: 'blur' }],
        country: [{ required: true, message: 'Country is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      dialogFormVisible: false,
      formItemDisable: false,
      dialogStatus: '',
      dialogLoading: false,
      deleteDialogVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true

      getAllCity().then(res => {
        this.list = res.data.data
        this.listLoading = false
      }).catch(() => { console.error('Error fetching cities:', error) })
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogLoading = false
      this.formItemDisable = false
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.dialogLoading = true
          createCity(this.currCity).then((res) => {
            this.dialogLoading = false
            if (res.data.code == 200) {
              this.getList()
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: 'City Created Successfully',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: 'City Created Error',
                message: res.data.msg,
                type: 'error',
                duration: 2000
              })
            }

          })
        }
      })
    },
    handleUpdate(row) {
      this.currCity = Object.assign({}, row) // copy obj
      this.dialogLoading = false
      this.dialogStatus = 'update'
      this.formItemDisable = true
      console.log(this.formItemDisable)
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log(this.currCity)
          const tempData = Object.assign({}, this.currCity)
          this.dialogLoading = true
          editCity(tempData).then((res) => {

            this.dialogLoading = false
            if (res.data.code == 200) {
              this.getList()
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: 'City Updated Successfully',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: 'City Updated Error',
                message: res.data.msg,
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      })
    },
    handleDelete(row) {
      this.deleteDialogVisible = true
      this.temp = row
    },
    deleteData() {
      deleteCity(this.temp.id).then((res) => {
        this.deleteDialogVisible = false
        this.getList()
        if (res.data.code == 200) {
          this.$notify({
            title: 'Success',
            message: res.data.msg,
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: 'City Delete Error',
            message: res.data.msg,
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    resetForm(dataForm) {
      this.dialogFormVisible = false
      this.$refs[dataForm].resetFields()
    },
    handleReturn() {
      this.$router.push({
        path: '/',
      });
    }
  }
}
</script>
