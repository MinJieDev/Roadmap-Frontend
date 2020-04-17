<template>
  <div>
    <MenuItem name="del-connection" @click.native="handleClkDelConnection" ref="MenuItem">
      Del Connection
    </MenuItem>
    <Modal
      v-model="connectionDelFormModal"
      title="Del Connection"
      @on-ok="ok"
      @on-cancel="cancel">
      <p>Node1 Name</p>
      <Input v-model="connectionInfo.node1" placeholder="Enter something..." style="width: 300px" />
      <p>Node2 Name</p>
      <Input v-model="connectionInfo.node2" placeholder="Enter something..." style="width: 300px" />
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'DelConnectionForm',
  data() {
    return {
      connectionDelFormModal: false,
      connectionInfo: {
        node1: '',
        node2: '',
      },
    };
  },
  methods: {
    ok() {
      this.$Message.info('Connection deleted');
      this.$emit('connection-deleted', this.connectionInfo);
    },
    cancel() {
      //  this.$Message.info('Clicked cancel');
    },
    handleClkDelConnection() {
      this.connectionDelFormModal = true;
      this.$Message.info('handleClk');
    },
  },
};
</script>
