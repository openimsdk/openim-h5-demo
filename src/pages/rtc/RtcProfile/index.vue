<template>
  <SingleProfile
    :userInfo="inviteData?.participant?.userInfo"
    :isVideo="isVideo"
    :isWaiting="isWaiting"
    :isRecv="isRecv"
  />
</template>

<script lang="ts" setup>
import { Room } from 'livekit-client'
import { InviteData } from '../data'

import SingleProfile from './SingleProfile.vue'
import useInviteData from '../useInviteData'

type RtcProfileProps = {
  room: Room
  inviteData: InviteData
  isWaiting: boolean
}
const props = defineProps<RtcProfileProps>()

const { isVideo, isRecv } = useInviteData(props.inviteData)
</script>
