<template>
    <div ref="target">
        <van-grid class="px-6 py-4" :border="false" :column-num="4">
            <van-grid-item v-for="action in actionList" :key="action.type" clickable :icon="action.icon" :text="action.text"
                @click="clickAction(action)" />
        </van-grid>
        <van-uploader v-show="false" ref="uploaderRef" :accept="uploadChooseOptions.accept"
            :capture="uploadChooseOptions.capture" :preview-image="false" multiple max-count="9"
            :after-read="afterReadFile" />
        <van-action-sheet v-model:show="actionSheetVisible" teleport="body" :actions="actionSheetActions"
            @select="onActionSelect" />
        <div class="dac"></div>
    </div>
</template>

<script setup lang='ts'>
import chating_action_image from '@/assets/images/chating_action_image.png'
import chating_action_camera from '@/assets/images/chating_action_camera.png'
import { onClickOutside } from '@vueuse/core'
import { ActionSheetAction, UploaderFileListItem, UploaderInstance, showLoadingToast } from 'vant'
import { ContactChooseEnum } from '@/pages/contact/chooseUser/data'
import { ToastWrapperInstance } from 'vant/lib/toast/types'

const { t } = useI18n()

type ChatFooterActionEmits = {
    (event: 'closeActionBar'): void;
    (event: 'getFile', uploadData: UploaderFileListItem): void;
}

enum ChatFooterActionType {
    Album,
    Shoot,
    VideoCall,
    File,
    IDCard,
    Location
}

type ChatFooterActionItem = {
    text: string;
    icon: string;
    type: ChatFooterActionType;
}

const actionList: ChatFooterActionItem[] = [
    {
        text: t('footerAction.album'),
        icon: chating_action_image,
        type: ChatFooterActionType.Album,
    },
    {
        text: t('footerAction.shoot'),
        icon: chating_action_camera,
        type: ChatFooterActionType.Shoot,
    },
]

const albumActions = [
    {
        name: t('picture'),
        type: ChatFooterActionType.Album
    },
    {
        name: t('video'),
        type: ChatFooterActionType.Album
    },
] as unknown as ActionSheetAction[]

const shootActions = [
    {
        name: t('photograph'),
        type: ChatFooterActionType.Shoot
    },
    {
        name: t('recording'),
        type: ChatFooterActionType.Shoot
    }
] as unknown as ActionSheetAction[]

const router = useRouter();
const emit = defineEmits<ChatFooterActionEmits>();

const actionSheetVisible = ref(false)
const actionSheetActions = ref<ActionSheetAction[]>([])
const uploadChooseOptions = reactive({
    accept: '*',
    capture: undefined as any
})
const target = ref(null)
const uploaderRef = ref<UploaderInstance>()

let loadToast: ToastWrapperInstance | null = null;

onClickOutside(target, () => emit('closeActionBar'), {
    ignore: ['.van-overlay', '.van-action-sheet__content']
})



const onActionSelect = ({ type }: any, idx: number) => {
    uploadChooseOptions.accept = idx === 0 ? 'image/*' : 'video/*'
    if (type === ChatFooterActionType.Shoot) {
        uploadChooseOptions.capture = idx === 0 ? 'camera' : 'camcorder'
    }
    nextTick(() => uploaderRef.value?.chooseFile())
    actionSheetVisible.value = false;
}

const clickAction = ({ type }: ChatFooterActionItem) => {
    console.log(type);
    switch (type) {
        case ChatFooterActionType.Album:
            actionSheetActions.value = [...albumActions]
            actionSheetVisible.value = true
            break;
        case ChatFooterActionType.Shoot:
            actionSheetActions.value = [...shootActions]
            actionSheetVisible.value = true
            break;
        case ChatFooterActionType.File:
            uploadChooseOptions.accept = '*';
            uploadChooseOptions.capture = undefined;
            nextTick(() => uploaderRef.value?.chooseFile())
            break;
        case ChatFooterActionType.VideoCall:

            break;
        case ChatFooterActionType.IDCard:
            router.push({
                path: 'chooseUser',
                state: {
                    chooseType: ContactChooseEnum.ChooseCard,
                }
            })
            break;
        case ChatFooterActionType.Location:
            break;
        default:
            break;
    }
    // emit('closeActionBar')
}

const afterReadFile = (data: UploaderFileListItem | UploaderFileListItem[]) => {
    if (!Array.isArray(data)) {
        data = [data]
    }
    data.map(item => {
        emit('getFile', item)
    })
}

</script>

<style lang='scss' scoped>
:deep(.van-icon__image) {
    width: 48px;
    height: 48px;
}

:deep(.van-grid-item__content) {
    padding: 6px 8px;
}
</style>