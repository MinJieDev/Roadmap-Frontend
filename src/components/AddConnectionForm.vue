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
      <Select v-model="connectionInfo.sourceNode" filterable>
        <Option v-for="item in nodeNameList" :value="item" :key="item">{{ item }}</Option>
      </Select>
      <p>Target Node</p>
      <Select v-model="connectionInfo.targetNode" filterable>
        <Option v-for="item in nodeNameList" :value="item" :key="item">{{ item }}</Option>
      </Select>
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'AddConnectionForm',
  props: ['nodeNameList'],
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
