<template>
  <div>
    <Button
      type="primary"
      shape="circle"
      @click="UserReportModal = true">
      <Icon type="md-chatboxes"/>
    </Button>
    <Modal
      v-model="UserReportModal"
      title="期待您的宝贵建议"
      @on-ok="okModal"
      @on-close="cancelModal"
      @on-cancel="cancelModal">
      <h3>您的联系方式(E-Mail)</h3>
      <Input v-model="UserEmail" placeholder="可以不填哦" clearable style="width: 200px"/>
      <br>
      <br>
      <h3>您对我们网站打多少分？</h3>
      <Rate allow-half v-model="UserRating"/>
      <br>
      <br>
      <h3>您对我们网站的建议？</h3>
      <Input v-model="UserSuggest" type="textarea" placeholder="您的建议是我们前进的动力"/>
    </Modal>
  </div>
</template>

<script>
import { createFeedBack } from '../apis/FeedBackApis';
import { pushErr } from '../components/ErrPush';

export default {
  name: 'UserReportButton',
  data() {
    return {
      UserReportModal: false,
      UserRating: 4,
      UserEmail: '',
      UserSuggest: '',
    };
  },
  methods: {
    okModal() {
      createFeedBack(this.UserEmail, this.UserRating, this.UserSuggest).then(() => {
        this.$Message.info('感谢您的反馈，我们会努力改进 ~');
      }).catch((err) => {
        pushErr(this, err, true);
        // this.$Message.error('网络错误');
      });

      this.cancelModal();
    },
    cancelModal() {
      this.UserReportModal = false;
      this.UserRating = 4;
      this.UserEmail = '';
      this.UserSuggest = '';
    },
  },
};
</script>

<style scoped>

</style>
