<template>
    <div @click="playAudio" class="audio_message_container need_bg" :class="{'audio_message_container_self':isSelfMsg}">
        <div class="cricleplay">
            <div class="small"></div>
            <div class="middle" :class="{'stopanimate':!playing}"></div>
            <div class="large" :class="{'stopanimate':!playing}"></div>
        </div>
        <span class="text-sm">{{message.soundElem.duration}}''</span>
        <audio ref="audioRef" />
    </div>
</template>

<script setup lang='ts'>
import { ExedMessageItem } from './data';


type AudioMessageRendererProps = {
    message: ExedMessageItem;
    isSelfMsg: boolean;
}

const props = defineProps<AudioMessageRendererProps>();

const playing = ref(false)
const pausing = ref(false)
const audioRef = ref<HTMLAudioElement>()

const playAudio = () => {
    if(playing.value){
        audioRef.value?.pause()
        playing.value = false
    }else {
        if(!pausing.value){
            audioRef.value!.src = props.message.soundElem.sourceUrl
        }
        audioRef.value?.play()
        pausing.value = false
    }
}

onMounted(() => {
    nextTick(() => {
        if (!audioRef.value) return;
        audioRef.value.onplay = () => {
            playing.value = true
        }
        audioRef.value.onpause = () => {
            pausing.value = true
            playing.value = false
        }
        audioRef.value.onended = () => {
            pausing.value = false
            playing.value = false
        }
    })
})

</script>

<style lang='scss' scoped>
.audio_message_container {
    display: flex;
    justify-content: center;
    align-items: center;

    .cricleplay {
        display: flex;
        align-items: center;
        margin-right: 6px;

        .small {
            width: 5px;
            height: 5px;
            border-width: 3px;
            border-style: solid;
            border-color: #3870e4;
            border-top-color: transparent;
            border-left-color: transparent;
            border-bottom-color: transparent;
            border-radius: 50%;
            box-sizing: border-box;
            vertical-align: middle;
            display: inline-block;
        }

        .middle {
            width: 10px;
            height: 10px;
            border-width: 2px;
            border-style: solid;
            border-color: #3870e4;
            border-top-color: transparent;
            border-left-color: transparent;
            border-bottom-color: transparent;
            border-radius: 50%;
            box-sizing: border-box;
            vertical-align: middle;
            display: inline-block;
            margin-left: -5px;
            animation: show2 2s ease-in-out infinite;
            opacity: 1;
        }

        @keyframes show2 {
            0% {
                opacity: 0;
            }

            30% {
                opacity: 1;
            }

            100% {
                opacity: 0;
            }
        }

        .large {
            width: 20px;
            height: 20px;
            border-width: 2px;
            border-style: solid;
            border-color: #3870e4;
            border-top-color: transparent;
            border-left-color: transparent;
            border-bottom-color: transparent;
            border-radius: 50%;
            box-sizing: border-box;
            vertical-align: middle;
            display: inline-block;
            margin-left: -15px;
            animation: show3 2s ease-in-out infinite;
            opacity: 1;
        }

        @keyframes show3 {
            0% {
                opacity: 0;
            }

            60% {
                opacity: 1;
            }

            100% {
                opacity: 0;
            }
        }

        .stopanimate {
            -moz-animation-name: none;
            -webkit-animation-name: none;
            -ms-animation-name: none;
            animation-name: none;
        }
    }

    &_self {
        flex-direction: row-reverse;

        .cricleplay {
            margin-right: 0;
            margin-left: 6px;
            flex-direction: row-reverse;

            .small,
            .middle,
            .large {
                border-left-color: #3870e4;
                border-right-color: transparent;
            }

            .middle {
                margin-left: 0;
                margin-right: -5px;
            }

            .large {
                margin-left: 0;
                margin-right: -15px;
            }
        }
    }
}
</style>