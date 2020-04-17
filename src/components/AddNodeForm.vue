<template>
  <div>
    <MenuItem name="add-node" @click.native="handleClkAddNode" ref="MenuItem">Add Node</MenuItem>
    <Modal
      v-model="nodeFormModal"
      title="Add Node"
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
  data() {
    return {
      nodeFormModal: false,
      nodeInfo: {
        nodeName: '',
        nodeUrl: '',
      },
    };
  },
  methods: {
    ok() {
      this.$Message.info('Node added');
      this.$emit('node-added', this.nodeInfo);
    },
    cancel() {
      //  this.$Message.info('Clicked cancel');
    },
    handleClkAddNode() {
      this.nodeFormModal = true;
      this.$Message.info('handleClk');
    },
  },
};
</script>
