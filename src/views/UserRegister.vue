<template>
  <div style="margin-top: 200px">
    <t-row justify="center">
      <t-col :span="10">
        <h1 style="text-align: center; line-height:100px; margin-left: 60px;">用户注册</h1>
      </t-col>
    </t-row>
    <br />
    <t-row justify="center">
      <t-col :span="3">
        <div style="width: 400px">
          <t-form :data="formData" :rules="rules" ref="form" @reset="onReset" @submit="onSubmit" @validate="onValidate">
            <t-form-item label="用户名" name="account">
              <t-input v-model="formData.account" @blur="handleBlur()" placeholder="请输入账户名"></t-input>
            </t-form-item>
            <t-form-item label="密码" name="password">
              <t-input type="password" v-model="formData.password" placeholder="请输入密码"></t-input>
            </t-form-item>
            <t-form-item label="确认密码" name="rePassword">
              <t-input type="password" v-model="formData.rePassword" placeholder="请输入确认密码"></t-input>
            </t-form-item>
            <t-form-item style="padding-top: 8px">
              <t-button theme="primary" type="submit" style="margin-right: 10px">注册</t-button>
              <t-button theme="default" variant="base" type="reset">重置</t-button>
            </t-form-item>
          </t-form>
        </div>
      </t-col>
    </t-row>
  </div>
</template>

<script>
  import {
    postRequest
  } from "../util/httputil";

  const INITIAL_DATA = {
    account: "",
    password: "",
    rePassword: "",
  };

  export default {
    data() {
      return {
        formData: {
          ...INITIAL_DATA
        },
        rules: {
          account: [{
              required: true,
              message: "用户名不能为空",
              type: "error"
            },
            {
              min: 2,
              message: "至少需要两个字",
              type: "error",
              trigger: "blur",
            },
          ],
          password: [{
              required: true,
              message: "密码不能为空",
              type: "error"
            },
            // 不同的校验结果有不同的错误信息提醒，切错误信息类型不同
            {
              validator: this.passwordValidator
            },
          ],
          rePassword: [
            // 自定义校验规则
            {
              required: true,
              message: "确认密码不能为空",
              type: "error"
            },
            {
              validator: this.rePassword,
              message: "两次密码不一致"
            },
          ],
        },
      };
    },

    methods: {
      onReset() {
        this.$message.success("重置成功");
      },
      onSubmit({
        validateResult,
        firstError
      }) {
        if (validateResult === true) {
          let params = {
            username: this.formData.account,
            password: this.formData.password,
          };
          postRequest("/user/register", params).then((res) => {
            if (res.data.code === 200) {
              this.$message.success("注册成功，正在跳转到登录界面");
              this.$router.push("/login");
            } else {
              this.$message.error(res.data.msg);
            }
          });
        } else {
          console.log("Errors: ", validateResult);
          this.$message.warning(firstError);
        }
      },
      onValidate({
        validateResult,
        firstError
      }) {
        if (validateResult === true) {
          console.log("Validate Success");
        } else {
          console.log("Validate Errors: ", firstError, validateResult);
        }
      },
      handleBlur() {
        this.$refs.form.validate({
          fields: ["account"],
          trigger: "blur",
        });
      },
      // 自定义校验器，不同的值输出不同的校验结果。支持异步校验（文案选自某密码重置站点，如有侵权，请联系我们删除）
      passwordValidator(val) {
        if (val.length > 0 && val.length <= 2) {
          return {
            result: false,
            message: "太简单了！再开动一下你的小脑筋吧！",
            type: "error",
          };
        }
        if (val.length > 2 && val.length < 4) {
          return {
            result: false,
            message: "还差一点点，就是一个完美的密码了！",
            type: "warning",
          };
        }
        return {
          result: true,
          type: "success",
        };
      },
      // 自定义异步校验器
      rePassword(val) {
        return new Promise((resolve) => {
          const timer = setTimeout(() => {
            resolve(this.formData.password === val);
            clearTimeout(timer);
          });
        });
      },
    },
  };
</script>