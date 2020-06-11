<template>
  <div>
    <MenuItem name="add-node" @click.native="handleClkAddNode" ref="MenuItem">
      &ensp;新建节点
      <Icon type="md-git-commit" />
    </MenuItem>
    <Modal
      v-model="nodeFormModal"
      title="Add Node"
      @on-ok="ok"
      @on-cancel="cancel"
      @keydown.native.stop>
      <p>Node Name</p>
      <Input v-model="nodeInfo.nodeName" placeholder="Enter something..." style="width: 300px" />
      <p>Url</p>
      <Input v-model="nodeInfo.nodeUrl" placeholder="Enter something..." style="width: 300px" />
      <p>Color</p>
      <ColorPicker v-model="nodeInfo.color" recommend :hue="false"/>
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
        color: '#f5f5f5',
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
