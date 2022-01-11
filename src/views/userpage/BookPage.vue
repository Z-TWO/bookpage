<template>
  <t-row justify="center" :gutter="[0, 20]">
    <t-col :span="6">
      <div>
        <t-button theme="success" @click="getBookData()">查看所有书籍</t-button>
      </div>
    </t-col>
    <t-col :span="1" :offset="2">
      <div class="tdesign-demo-block-column" style="max-width: 200px">
        <t-input v-model="value" placeholder="输入关键词" />
      </div>
    </t-col>
    <t-col :span="1">
      <t-button variant="outline" @click="searchBook()"> 搜索 </t-button>
    </t-col>
    <t-col :span="10">
      <div>
        <t-table :data="data" :columns="columns" :rowKey="index" :height="500" :pagination="pagination"
          @page-change="onPageChange" :loading="loading">
          <template #info="{ row }">
            <p v-if="row.info === null">无</p>
            <p v-else>{{ row.info }}</p>
          </template>
          <template #currentNum="{ row }">
            <p :class="row.currentNum>0 ? 'status':'status unhealth'">{{row.currentNum}}</p>
          </template>
          <template #op-column>
            <p>操作</p>
          </template>
          <template #option="{ row }">
            <t-button @click="borrow(row)" theme="warning" :disabled="row.currentNum <= 0">借书</t-button>
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
        value: "",
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
            title: "序号"
          },
          {
            align: "center",
            colKey: "name",
            title: "书名",
          },
          {
            align: "center",
            colKey: "author",
            title: "作者",
          },
          {
            align: "center",
            colKey: "pressName",
            title: "出版社",
          },
          {
            align: "center",
            colKey: "pressDate",
            title: "发行日期",
          },
          {
            align: "center",
            colKey: "totalNum",
            title: "馆藏",
          },
          {
            align: "center",
            colKey: "currentNum",
            title: "可借",
          },
          {
            align: "center",
            colKey: "info",
            title: "描述",
          },
          {
            align: "center",
            colKey: "option",
            title: "操作",
          },
        ],
      };
    },
    methods: {
      //借书
      borrow({
        id
      }) {
        if (localStorage.getItem("bookToken") === null) {
          this.$message.warning("请先进行登录");
          return;
        }
        let params = {
          bId: id,
        };
        getRequest("/user/book/borrow", params).then((res) => {
          if (res.data.code == 200) {
            this.$message.success("操作成功");
            this.getBookData()
          } else {
            this.$message.error(res.data.msg);
          }
        });
      },
      //获取书本数据
      getBookData: function () {
        this.loading = true
        let params = {
          curr: this.pagination.current,
          size: this.pagination.pageSize,
        };
        getRequest("/book/", params).then((res) => {
          if (res.data.code == 200) {
            this.loading = false
            let datas = res.data.data;
            let start = (this.pagination.current - 1) * this.pagination.pageSize + 1
            let list = datas.list
            list.forEach(tem => {
              tem.index = start++;
            })
            this.data = list
            this.pagination.total = datas.total;
          }
        });
      },
      //查找书籍
      searchBook: function () {
        this.loading = true
        let params = {
          keyWorld: this.value,
          curr: this.pagination.current,
          size: this.pagination.size,
        };
        postRequest("/book/search", params).then((res) => {
          if (res.data.code === 200) {
            this.loading = false
            let datas = res.data.data;
            let start = (this.pagination.current - 1) * this.pagination.pageSize + 1
            let list = datas.list
            list.forEach(tem => {
              tem.index = start++;
            })
            this.data = list
            this.pagination.total = datas.total;
            if (this.pagination.total < this.pagination.pageSize) {
              this.pagination.current = 1
            }
          }
        });
      },
      //分页查询
      onPageChange: function (pageInfo) {
        this.pagination.current = pageInfo.current;
        this.pagination.pageSize = pageInfo.pageSize;
        if (this.value === "") {
          this.getBookData();
        } else {
          this.searchBook();
        }
      },
      verifyAccount: function () {
        this.token = localStorage.getItem("bookToken");
        if (this.token === null) {
          this.$message.warning("未登录");
          return
        }
        getRequest('/user/book/back', '')
          .then((res) => {
            if (res.data.code === 401) {
              localStorage.removeItem('bookToken')
              this.$message.error('token无效，请重新登录')
              location.reload();
              return
            }
          })
      }
    },
    created() {
      this.getBookData();
      this.verifyAccount()
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

  .status.unhealth {
    color: #E34D59;

    &::before {
      background-color: #E34D59;
    }
  }
</style>