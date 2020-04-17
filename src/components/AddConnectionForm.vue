<template>
  <div>
    <MenuItem name="add-connection" @click.native="handleClkAddConnection" ref="MenuItem">
      Add Connection
    </MenuItem>
    <Modal
      v-model="connectionFormModal"
      title="Add Connection"
      @on-ok="ok"
      @on-cancel="cancel">
      <p>Source Node</p>
      <Input v-model="connectionInfo.sourceNode"
             placeholder="Enter something..."
             style="width: 300px" />
      <p>Target Node</p>
      <Input v-model="connectionInfo.targetNode"
             placeholder="Enter something..."
             style="width: 300px" />
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'AddConnectionForm',
  data() {
    return {
      connectionFormModal: false,
      connectionInfo: {
        sourceNode: '',
        targetNode: '',
      },
    };
  },
  methods: {
    ok() {
      this.$Message.info('Connection added');
      this.$emit('connection-added', this.connectionInfo);
    },
    cancel() {
      //  this.$Message.info('Clicked cancel');
    },
    handleClkAddConnection() {
      this.connectionFormModal = true;
      this.$Message.info('handleClk');
    },
  },
};
</script>
