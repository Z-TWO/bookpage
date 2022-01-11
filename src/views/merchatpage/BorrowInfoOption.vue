<template>
  <t-row justify="center" :gutter="[0, 20]" style="margin-top: 70px;">
    <t-col :span="10">
      <div>
        <t-table :data="data" :columns="columns" :rowKey="index" :height="500" :pagination="pagination"
          @page-change="onPageChange" :loading="loading">
          <template #status="{ row }">
            <p v-if="row.status === 0" class="status warning">进行中</p>
            <p v-else class="status">已完成</p>
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

  export default {
    data() {
      return {
        index: "",
        token: null,
        loading: true,
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
            colKey: "book.name",
            title: "书名",
          },
          {
            align: "center",
            colKey: "user.username",
            title: "用户名",
          },
          {
            align: "center",
            colKey: "createTime",
            title: "借书时间",
          },
          {
            align: "center",
            colKey: "returnTime",
            title: "应还书时间",
          },
          {
            align: "center",
            colKey: "endTime",
            title: "实际还书时间",
          },
          {
            align: "center",
            colKey: "charge",
            title: "费用",
          },
          {
            align: "center",
            colKey: "status",
            title: "状态",
          },
        ],
      };
    },
    methods: {
      //分页查询
      onPageChange: function (pageInfo) {
        this.pagination.current = pageInfo.current;
        this.pagination.pageSize = pageInfo.pageSize;
        this.getUserBorrowInfo()
      },
      //查询当前用户
      getUserBorrowInfo: function () {
        this.loading = true
        let params = {
          curr: this.pagination.current,
          size: this.pagination.pageSize,
        };
        getRequest("/admin/user/borrowinfo", params).then((res) => {
          if (res.data.code === 200) {
            this.loading = false
            let datas = res.data.data;
            let start = (this.pagination.current - 1) * this.pagination.pageSize + 1;
            let list = datas.list
            list.forEach(tem => {
              tem.index = start++;
            })
            this.data = list
            this.pagination.total = datas.total;
          } else {
            this.$message.error(res.data.msg);
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
      this.getUserBorrowInfo();
    },
  };
</script>

<style scoped>
  .status {
    position: relative;
    color: #00a870;
    margin-left: 10px;

    &::before {
      position: absolute;
      top: 50%;
      left: 0px;
      transform: translateY(-50%);
      content: '';
      background-color: #00a870;
      width: 6px;
      height: 6px;
      margin-left: -10px;
      border-radius: 50%;
    }
  }

  .status.warning {
    color: #ED7B2F;

    &::before {
      background-color: #ED7B2F;
    }
  }
</style>