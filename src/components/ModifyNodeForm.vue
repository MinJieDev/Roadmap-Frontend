<template>
  <div>
    <MenuItem name="modify-node" @click.native="handleClkModifyNode" ref="MenuItem">修改节点</MenuItem>
    <Modal
      v-model="nodeFormModal"
      title="Modify Node"
      @on-ok="ok"
      @on-cancel="cancel">
      <p>Node Name</p>
      <Input v-model="nodeInfo.nodeName" placeholder="Enter something..." style="width: 300px" />
      <p>Url</p>
      <Input v-model="nodeInfo.nodeUrl" placeholder="Enter something..." style="width: 300px" />
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'AddNodeForm',
  props: ['nodeInfoOld'],
  data() {
    return {
      nodeFormModal: false,
      nodeInfo: {
        nodeName: this.nodeInfoOld.name,
        nodeUrl: this.nodeInfoOld.URI,
      },
    };
  },
  methods: {
    ok() {
      this.$Message.info('Node modified');
      this.$emit('node-modified', this.nodeInfo);
    },
    cancel() {
      //  this.$Message.info('Clicked cancel');
    },
    handleClkModifyNode() {
      this.nodeFormModal = true;
      this.$Message.info('handleClk');
    },
  },
};
</script>
