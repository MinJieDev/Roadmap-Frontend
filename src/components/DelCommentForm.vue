<template>
  <div>
    <MenuItem name="del-comment" @click.native="handleClkDelComment" ref="MenuItem">
      Delete Comment
    </MenuItem>
    <Modal
      v-model="delCommentFormModal"
      title="Delete Comment"
      @on-ok="ok"
      @on-cancel="cancel">
      <p>Node</p>
      <Select v-model="commentInfo.node" filterable>
        <Option v-for="item in nodeNameList" :value="item" :key="item">{{ item }}</Option>
      </Select>
      <p>Comment Content</p>
      <Select v-model="commentInfo.comment" filterable>
        <Option v-for="item in commentList" :value="item" :key="item">{{ item }}</Option>
      </Select>
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'AddCommentForm',
  props: ['nodeNameList', 'commentList'],
  data() {
    return {
      delCommentFormModal: false,
      commentInfo: {
        node: '',
        comment: '',
      },
    };
  },
  methods: {
    ok() {
      this.$Message.info('Comment deleted');
      this.$emit('comment-deleted', this.commentInfo);
    },
    cancel() {
      //  this.$Message.info('Clicked cancel');
    },
    handleClkDelComment() {
      if (this.nodeChose !== '') {
        this.$emit('node-comment-list-changed', this.nodeChose);
      }
      this.delCommentFormModal = true;
      this.$Message.info('handleClk');
    },
  },
  computed: {
    nodeChose() {
      return this.commentInfo.node;
    },
  },
  watch: {
    nodeChose(val) {
      this.$emit('node-comment-list-changed', val);
    },
  },
};
</script>
