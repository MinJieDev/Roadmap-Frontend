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
      <Select v-model="connectionInfo.node1" filterable>
        <Option v-for="item in nodeNameList" :value="item" :key="item">{{ item }}</Option>
      </Select>
      <p>Node2 Name</p>
      <Select v-model="connectionInfo.node2" filterable>
        <Option v-for="item in nodeNameList" :value="item" :key="item">{{ item }}</Option>
      </Select>
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'DelConnectionForm',
  props: ['nodeNameList'],
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
