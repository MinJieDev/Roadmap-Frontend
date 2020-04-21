<template>
  <div>
    <MenuItem name="load-roadmap" @click.native="handleClkLoadRoadmap" ref="MenuItem">
      Load Roadmap
    </MenuItem>
    <Modal
      v-model="loadRoadmapFormModal"
      title="Load Roadmap"
      @on-ok="ok"
      @on-cancel="cancel">
      <p>Roadmap Id</p>
      <Input v-model="roadmapInfo.roadmapId" placeholder="Enter Roadmap Id" style="width: 300px" />
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'LoadRoadmapForm',
  data() {
    return {
      loadRoadmapFormModal: false,
      roadmapInfo: {
        roadmapId: '',
      },
    };
  },
  methods: {
    ok() {
      this.$Notice.success({ title: 'RoadmapForm submitted' });
      this.$emit('roadmap-form-loaded', this.roadmapInfo);
    },
    cancel() {
      //  this.$Message.info('Clicked cancel');
    },
    handleClkLoadRoadmap() {
      this.loadRoadmapFormModal = true;
      this.$Message.info('handleClk');
    },
  },
};
</script>
