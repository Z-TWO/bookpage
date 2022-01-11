<template>
    <t-row justify="center" :gutter="[0, 20]" style="margin-top: 40px;">
        <t-col :span="6">
            <div>
                <t-button theme="success" @click="getBookData()">查看所有书籍</t-button>
                <t-button theme="primary" @click="addBook()" style="margin-left: 10px;">添加书籍</t-button>
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
                        <t-button @click="updateDialogShow(row)" theme="success">修改</t-button>
                        <t-button @click="deleteBook(row)" theme="danger" style="margin-top: 10px;">删除</t-button>
                    </template>
                </t-table>
                <br /><br />
                <t-dialog :visible.sync="visibleIdAttach" attach="#app" :header="optionType" destroyOnClose
                    :onConfirm="updateBook">
                    <div slot="body">
                        <t-form :data="formData" :labelAlign="formData.labelAlign" :labelWidth="60">
                            <t-form-item label="书名" name="name">
                                <t-input v-model="formData.name"></t-input>
                            </t-form-item>
                            <t-form-item label="作者" name="author">
                                <t-input v-model="formData.author" type="text"></t-input>
                            </t-form-item>
                            <t-form-item label="出版社" name="pressName">
                                <t-input v-model="formData.pressName" type="text"></t-input>
                            </t-form-item>
                            <t-form-item label="发行日期" name="pressDate">
                                <t-date-picker v-model="formData.pressDate" mode="year" format="YYYY" clearable>
                                </t-date-picker>
                            </t-form-item>
                            <t-form-item label="馆藏" name="totalNum">
                                <t-input-number v-model="formData.totalNum" :min="0"></t-input-number>
                            </t-form-item>
                            <t-form-item label="可借" name="currentNum">
                                <t-input-number v-model="formData.currentNum" :min="0"></t-input-number>
                            </t-form-item>
                            <t-form-item label="描述" name="info">
                                <t-input v-model="formData.info" type="text"></t-input>
                            </t-form-item>
                        </t-form>
                    </div>
                </t-dialog>
            </div>
        </t-col>
    </t-row>
</template>

<script>
    const INITIAL_DATA = {
        labelAlign: 'left',
        id: 0,
        name: '',
        author: '',
        pressName: '',
        pressDate: null,
        totalNum: 0,
        currentNum: 0,
        info: ''
    };

    import {
        getRequest,
        postRequest,
        deleteRequest,
        postJsonRequest,
        putRequest
    } from "@/util/httputil.js";

    export default {
        data() {
            return {
                value: "",
                index: "",
                token: null,
                loading: true,
                data: [],
                optionType: '',
                formData: {
                    ...INITIAL_DATA
                },
                visibleIdAttach: false,
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
            //获取书本数据
            getBookData: function () {
                this.loading = true
                let params = {
                    curr: this.pagination.current,
                    size: this.pagination.pageSize,
                };
                getRequest("/book/", params).then((res) => {
                    this.loading = false
                    if (res.data.code == 200) {
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
            //删除书籍
            deleteBook: function (o) {
                if (this.mydialog) {
                    this.mydialog.show();
                    return;
                }
                this.mydialog = this.$dialog({
                    body: '你确定要删除么?',
                    className: 't-dialog-new-class1 t-dialog-new-class2',
                    style: 'color: rgba(0, 0, 0, 0.6)',
                    onConfirm: ({
                        e
                    }) => {
                        deleteRequest('/book/' + o.id, '').then((res) => {
                            if (res.data.code === 200) {
                                this.$message.success('删除成功')
                                this.getBookData()
                            } else {
                                this.$message.error(res.data.msg)
                            }
                        })
                        this.mydialog.hide();
                    },
                });
            },
            //修改书籍
            updateDialogShow: function (o) {
                this.optionType = '修改书籍'
                this.visibleIdAttach = true
                this.formData.name = o.name
                this.formData.author = o.author
                this.formData.pressName = o.pressName
                this.formData.pressDate = new Date(o.pressDate + '')
                this.formData.totalNum = o.totalNum
                this.formData.currentNum = o.currentNum
                this.formData.info = o.info
                this.formData.id = o.id
            },
            updateBook: function () {
                let params = {
                    name: this.formData.name,
                    author: this.formData.author,
                    pressName: this.formData.pressName,
                    pressDate: new Date(this.formData.pressDate).getFullYear(),
                    totalNum: this.formData.totalNum,
                    currentNum: this.formData.currentNum,
                    info: this.formData.info
                }

                if (this.optionType === '修改书籍') {
                    params['id'] = this.formData.id
                    putRequest('/book/', params, true)
                        .then((res) => {
                            if (res.data.code === 200) {
                                this.$message.success('更新成功')
                                this.getBookData()
                            } else {
                                this.$message.error(res.data.msg)
                            }
                        })
                } else {
                    postJsonRequest('/book/', params)
                        .then((res) => {
                            if (res.data.code === 200) {
                                this.$message.success('添加成功')
                                this.getBookData()
                            } else {
                                this.$message.error(res.data.msg)
                            }
                        })

                }
                this.visibleIdAttach = false
            },
            //添加书籍
            addBook: function () {
                this.visibleIdAttach = true
                this.optionType = '添加书籍'
                this.formData.name = ''
                this.formData.author = ''
                this.formData.pressName = ''
                this.formData.pressDate = new Date()
                this.formData.totalNum = 0
                this.formData.currentNum = 0
                this.formData.info = ''
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
            this.getBookData();
        },
    };
</script>