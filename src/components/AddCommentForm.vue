<template>
  <div>
    <MenuItem name="add-comment" @click.native="handleClkAddComment" ref="MenuItem">
      Add Comment
    </MenuItem>
    <Modal
      v-model="commentFormModal"
      title="Add Comment"
      @on-ok="ok"
      @on-cancel="cancel">
      <p>Node</p>
      <Select v-model="commentInfo.node" filterable>
        <Option v-for="item in nodeNameList" :value="item" :key="item">{{ item }}</Option>
      </Select>
      <p>Comment Content</p>
      <Input v-model="commentInfo.comment" type="textarea" placeholder="Enter comment..."/>
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'AddCommentForm',
  props: ['nodeNameList'],
  data() {
    return {
      commentFormModal: false,
      commentInfo: {
        node: '',
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
