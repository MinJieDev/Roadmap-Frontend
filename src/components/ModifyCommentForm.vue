<template>
  <div>
    <MenuItem name="modify-comment" @click.native="handleClkModifyComment" ref="MenuItem">
      修改注释
    </MenuItem>
    <Modal
      v-model="commentFormModal"
      title="修改注释"
      @on-ok="ok"
      @on-cancel="cancel"
      @keydown.native.stop>
      <p>注释内容</p>
      <Input v-model="commentInfo.comment" type="textarea" placeholder="请输入注释内容..."/>
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'ModifyCommentForm',
  props: ['comment'],
  data() {
    return {
      commentFormModal: false,
      commentInfo: {
        comment: this.comment,
      },
    };
  },
  methods: {
    ok() {
      this.$Message.info('Connection modified');
      this.$emit('comment-modified', this.commentInfo);
    },
    cancel() {
      //  this.$Message.info('Clicked cancel');
    },
    handleClkModifyComment() {
      this.commentFormModal = true;
      this.$Message.info('handleClk');
    },
  },
};
</script>
