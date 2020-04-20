<template>
  <div>
    <MenuItem name="del-node" @click.native="handleClkDelNode" ref="MenuItem">Del Node</MenuItem>
    <Modal
      v-model="nodeDelFormModal"
      title="Del Node"
      @on-ok="ok"
      @on-cancel="cancel">
      <p>Node Name</p>
      <Select v-model="nodeInfo.nodeName" filterable>
        <Option v-for="item in nodeNameList" :value="item" :key="item">{{ item }}</Option>
      </Select>
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'DelNodeForm',
  props: ['nodeNameList'],
  data() {
    return {
      nodeDelFormModal: false,
      nodeInfo: {
        nodeName: '',
      },
    };
  },
  methods: {
    ok() {
      this.$Message.info('Node deleted');
      this.$emit('node-deleted', this.nodeInfo);
    },
    cancel() {
      //  this.$Message.info('Clicked cancel');
    },
    handleClkDelNode() {
      this.nodeDelFormModal = true;
      this.$Message.info('handleClk');
    },
  },
};
</script>
