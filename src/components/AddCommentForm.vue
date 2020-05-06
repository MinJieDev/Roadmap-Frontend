<template>
  <div>
    <MenuItem name="add-comment" @click.native="handleClkAddComment" ref="MenuItem">
      添加注释
      <Icon type="md-clipboard" />
    </MenuItem>
    <Modal
      v-model="commentFormModal"
      title="添加注释"
      @on-ok="ok"
      @on-cancel="cancel">
      <p>注释内容</p>
      <Input v-model="commentInfo.comment" type="textarea" placeholder="请输入注释内容..."/>
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'AddCommentForm',
  data() {
    return {
      commentFormModal: false,
      commentInfo: {
        comment: '',
      },
    };
  },
  methods: {
    ok() {
      this.$Message.info('Connection added');
      this.$emit('comment-added', this.commentInfo);
    },
    cancel() {
      //  this.$Message.info('Clicked cancel');
    },
    handleClkAddComment() {
      this.commentFormModal = true;
      this.$Message.info('handleClk');
    },
  },
};
</script>
