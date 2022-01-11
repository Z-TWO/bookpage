<template>
  <t-row justify="center" :gutter="[0, 20]" style="margin-top: 80px; margin-bottom: 20px;">
    <t-col :span="10">
      <div>
        <t-table :data="data" :columns="columns" :rowKey="index" :height="500" :pagination="pagination"
          @page-change="onPageChange" :loading="loading">
          <template #enable="{ row }">
            <t-switch size="large" v-model="data[row.index - 1].enable" :customValue="[1, 0]" :change="onChange(row)">
            </t-switch>
          </template>
        </t-table>
        <br /><br />
      </div>
    </t-col>
  </t-row>
</template>

<script>
  import {
    getRequest,
    postRequest
  } from "@/util/httputil.js";

  const customValue = [0, 1];

  export default {
    data() {
      return {
        value: "",
        index: "",
        loading: true,
        token: null,
        data: [],
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0,
          onChange: (pageInfo) => {
            this.pagination.current = pageInfo.current;
            this.pagination.pageSize = pageInfo.pageSize;
            if (this.pagination.total <= this.pagination.pageSize)
              this.pagination.curr = 1;
          },
        },
        columns: [{
            align: "center",
            colKey: "index",
            title: "序号",
          },
          {
            align: "center",
            colKey: "username",
            title: "用户名",
          },
          {
            align: "center",
            colKey: "enable",
            title: "账号启用",
          },
        ],
      };
    },
    methods: {
      //分页查询
      onPageChange: function (pageInfo) {
        this.pagination.current = pageInfo.current;
        this.pagination.pageSize = pageInfo.pageSize;
      },
      //获取所有用户
      getUser: function () {
        this.loading = true
        let params = {
          curr: this.pagination.current,
          size: this.pagination.pageSize,
        };
        getRequest("/admin/user", params).then((res) => {
          if (res.data.code == 200) {
            this.loading = false
            let datas = res.data.data;
            let start =
              (this.pagination.current - 1) * this.pagination.pageSize + 1;
            let list = datas.list;
            list.forEach((tem) => {
              tem.index = start++;
            });
            this.data = list;
            this.pagination.total = datas.total;
          }
        });
      },
      //修改账号权限
      onChange: function (o) {
        let params = {
          uid: o.id,
          status: o.enable
        };
        postRequest("/admin/user/status", params).then((res) => {
          if (res.data.code != 200) {
            this.$message.error("发送错误");
          }
        });
      },
      verifyAccount: function () {
        this.token = localStorage.getItem("bookToken");
        if (this.token === null) {
          this.$message.error("未登录无法访问，正在跳转到登录界面");
          this.$router.push('/merchant/login')
          return
        }
        getRequest('/admin/user/borrowinfo', '')
          .then((res) => {
            if (res.data.code === 401) {
              localStorage.removeItem('bookToken')
              this.$message.error('token无效，请重新登录')
              this.$router.push('/merchant/login')
              return
            }
          })
      }
    },
    created() {
      this.verifyAccount()
      this.getUser();
    },
  };
</script>