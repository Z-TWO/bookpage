<template>
    <div class="tdesign-demo-item--layout">
        <t-layout>

            <t-aside>
                <t-menu theme="light" defaultValue="bookOption" style="margin-right: 50px" height="550px">
                    <h1 class="logo" style="color: #40a9ff;  margin-left: 20px;">图书管理系统
                    </h1>
                    <t-divider></t-divider>
                    <t-menu-item value="bookOption" @click="toBookOption">
                        <icon slot="icon" name="server" />图书管理
                    </t-menu-item>
                    <t-menu-item value="userOption" @click="toUserOption">
                        <icon slot="icon" name="user-circle" />用户管理
                    </t-menu-item>
                    <t-menu-item value="borrowOption" @click="toBorrowOption">
                        <icon slot="icon" name="root-list" />借书管理
                    </t-menu-item>
                    <template #operations>
                        <t-button theme="danger" @click="logout">退出登陆</t-button>
                    </template>
                </t-menu>
            </t-aside>

            <t-layout>

                <t-content>
                    <router-view />
                </t-content>

                <t-footer>Copyright @ 2021-{{new Date().getFullYear()}} ZTwo. All Rights Reserved</t-footer>

            </t-layout>
        </t-layout>
    </div>
</template>
<script>
    import {
        Icon
    } from 'tdesign-icons-vue';

    import {
        getRequest
    } from '@/util/httputil'

    export default {
        components: {
            Icon,
        },
        methods: {
            toBookOption: function () {
                if (this.$route.path != '/merchant/index/bookoption') {
                    this.$router.push('/merchant/index/bookoption')
                }
            },
            toUserOption: function () {
                if (this.$route.path != '/merchant/index/useroption') {
                    this.$router.push('/merchant/index/useroption')
                }
            },
            toBorrowOption: function () {
                if (this.$route.path != '/merchant/index/borrowoption') {
                    this.$router.push('/merchant/index/borrowoption')
                }
            },
            logout: function () {
                localStorage.removeItem('bookToken')
                this.$router.push('/merchant/login')
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
            if (this.$route.path != '/merchant/index/bookoption') {
                this.toBookOption()
            }
        },
    };
</script>