/**
 * 数字人朗读组件
 * 为场景详情页面提供自动朗读功能
 * 使用Lottie动画实现专业级数字人效果
 */

class DigitalHuman {
    constructor() {
        this.synth = window.speechSynthesis;
        this.utterance = null;
        this.isSpeaking = false;
        this.currentText = '';
        this.container = null;
        this.player = null;
        this.speakTimeout = null; // 添加防抖变量
        
        this.init();
    }
    
    init() {
        this.createDigitalHuman();
        this.initEventListeners();
    }
    
    // 创建数字人界面
    createDigitalHuman() {
        // 创建数字人容器
        this.container = document.createElement('div');
        this.container.id = 'digital-human-container';
        this.container.className = 'digital-human-container';
        
        // 创建数字人内容
        this.container.innerHTML = `
            <div class="digital-human-header">
                <div class="digital-human-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    反霸凌小助手
                </div>
                <button class="digital-human-close" id="digital-human-close">×</button>
            </div>
            <div class="digital-human-body">
                <div class="digital-human-animation" id="digital-human-animation">
                    <!-- Lottie动画将在这里 -->
                </div>
                <div class="digital-human-status">
                    <div class="status-indicator" id="status-indicator"></div>
                    <span class="status-text" id="status-text">准备就绪</span>
                </div>
            </div>
        `;
        
        // 添加到页面
        document.body.appendChild(this.container);
        
        // 创建Lottie动画
        this.createLottieAnimation();
    }
    
    // 创建Lottie动画
    createLottieAnimation() {
        this.animationElement = document.getElementById('digital-human-animation');
        
        // 创建Lottie播放器
        this.animationElement.innerHTML = `
            <lottie-player
                id="lottie-player"
                autoplay
                loop
                mode="normal"
                src="data/Batman.json"
                style="width: 100%; height: 100%;">
            </lottie-player>
        `;
        
        // 获取播放器实例
        this.player = document.getElementById('lottie-player');
        
        // 监听加载完成事件
        this.player.addEventListener('load', () => {
            // Lottie动画加载完成
        });
        
        this.player.addEventListener('error', (error) => {
            console.error('Lottie动画加载错误:', error);
            this.updateStatus('动画加载失败', false);
        });
        
        // 添加CSS样式
        this.addAnimationStyles();
    }
    
    // 添加动画样式
    addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .digital-human-container {
                position: fixed;
                right: 20px;
                bottom: 20px;
                width: 300px;
                height: 400px;
                background: transparent;
                border-radius: 0;
                box-shadow: none;
                overflow: visible;
                transform: translateX(350px);
                transition: transform 0.5s ease-in-out;
                z-index: 1000;
                border: none;
            }
            
            .digital-human-container.active {
                transform: translateX(0);
            }
            
            .digital-human-header {
                background: transparent;
                color: #333;
                padding: 12px 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-family: 'SimHei', 'Microsoft YaHei UI', sans-serif;
                font-weight: bold;
                font-size: 14px;
            }
            
            .digital-human-title {
                display: flex;
                align-items: center;
                gap: 8px;
                color: #333;
            }
            
            .digital-human-close {
                background: rgba(255, 255, 255, 0.8);
                border: none;
                color: #333;
                font-size: 20px;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background-color 0.3s;
            }
            
            .digital-human-close:hover {
                background-color: rgba(255, 255, 255, 1);
            }
            
            .digital-human-body {
                padding: 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 15px;
                background: transparent;
                height: calc(100% - 60px);
            }
            
            .digital-human-animation {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 280px;
                background: transparent;
                border-radius: 0;
                overflow: visible;
            }
            
            .digital-human-status {
                display: flex;
                align-items: center;
                gap: 8px;
                font-family: 'SimHei', 'Microsoft YaHei UI', sans-serif;
                font-size: 12px;
                color: #333;
                background: rgba(255, 255, 255, 0.8);
                padding: 8px 12px;
                border-radius: 20px;
                backdrop-filter: blur(10px);
            }
            
            .status-indicator {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: #ccc;
                transition: background-color 0.3s;
            }
            
            .status-indicator.active {
                background: #4CAF50;
                box-shadow: 0 0 8px #4CAF50;
                animation: pulse 1.5s infinite;
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }
            
            /* Lottie播放器样式 */
            lottie-player {
                width: 100%;
                height: 100%;
                border-radius: 0;
                overflow: visible;
                background: transparent;
            }
            
            /* 响应式设计 */
            @media (max-width: 768px) {
                .digital-human-container {
                    width: 250px;
                    height: 350px;
                    right: 10px;
                    bottom: 10px;
                }
                
                .digital-human-animation {
                    height: 230px;
                }
            }
            
            @media (max-width: 480px) {
                .digital-human-container {
                    width: 200px;
                    height: 300px;
                }
                
                .digital-human-animation {
                    height: 180px;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // 初始化事件监听
    initEventListeners() {
        // 关闭按钮
        document.getElementById('digital-human-close').addEventListener('click', () => {
            this.hide();
        });
    }
    
    // 显示数字人
    show() {
        this.container.classList.add('active');
    }
    
    // 隐藏数字人
    hide() {
        this.container.classList.remove('active');
        this.stopSpeaking();
    }
    
    // 更新状态
    updateStatus(text, isActive = false) {
        const statusText = document.getElementById('status-text');
        const statusIndicator = document.getElementById('status-indicator');
        
        statusText.textContent = text;
        statusIndicator.classList.toggle('active', isActive);
    }
    
    // 朗读文本
    speak(text) {
        if (!text) {
            return;
        }
        
        // 如果正在朗读，先停止当前朗读
        if (this.isSpeaking) {
            this.synth.cancel();
            this.isSpeaking = false;
        }
        
        // 添加防抖：避免快速连续调用
        if (this.speakTimeout) {
            clearTimeout(this.speakTimeout);
        }
        
        this.speakTimeout = setTimeout(() => {
            this._startSpeaking(text);
        }, 100);
    }
    
    // 内部方法：开始语音合成
    _startSpeaking(text) {
        this.currentText = text;
        this.show();
        this.updateStatus('正在朗读...', true);
        
        // 创建语音实例
        this.utterance = new SpeechSynthesisUtterance(text);
        this.utterance.lang = 'zh-CN';
        this.utterance.rate = 1.0;
        this.utterance.pitch = 1.05;
        this.utterance.volume = 0.85;
        
        // 选择最佳女声
        const voices = this.synth.getVoices();
        let bestVoice = null;
        
        // 优先选择中文女声
        bestVoice = voices.find(voice => 
            voice.lang.includes('zh') && 
            (voice.name.includes('Female') || voice.name.includes('女') || 
             voice.name.includes('Tingting') || voice.name.includes('婷婷'))
        );
        
        // 如果没有找到中文女声，选择任何中文语音
        if (!bestVoice) {
            bestVoice = voices.find(voice => voice.lang.includes('zh'));
        }
        
        // 如果还是没有，选择默认语音
        if (!bestVoice && voices.length > 0) {
            bestVoice = voices[0];
        }
        
        if (bestVoice) {
            this.utterance.voice = bestVoice;
        }
        
        // 事件处理
        this.utterance.onstart = () => {
            this.isSpeaking = true;
            this.updateStatus('正在朗读...', true);
            this.startLipSync();
        };
        
        this.utterance.onend = () => {
            this.isSpeaking = false;
            this.updateStatus('朗读完成', false);
            this.stopLipSync();
            
            // 3秒后自动隐藏
            setTimeout(() => {
                if (!this.isSpeaking) {
                    this.hide();
                }
            }, 3000);
        };
        
        // 错误处理 - 优化interrupted错误处理
        this.utterance.onerror = (event) => {
            this.isSpeaking = false;
            this.stopLipSync();
            
            // 根据错误类型处理
            if (event.error === 'interrupted') {
                // interrupted是正常现象，通常发生在页面切换或快速连续调用时
                this.updateStatus('朗读完成', false);
                // 不显示错误状态，因为这是正常的
            } else if (event.error === 'canceled') {
                this.updateStatus('朗读已取消', false);
            } else {
                console.warn('语音合成出现错误:', event.error);
                this.updateStatus('朗读出错', false);
            }
        };
        
        // 开始朗读
        try {
            this.synth.speak(this.utterance);
        } catch (error) {
            console.error('启动语音合成失败:', error);
            this.isSpeaking = false;
            this.updateStatus('朗读失败', false);
        }
    }
    
    // 停止朗读
    stopSpeaking() {
        if (this.isSpeaking) {
            try {
                this.synth.cancel();
            } catch (error) {
                console.warn('停止语音合成时出错:', error);
            }
            this.isSpeaking = false;
            this.updateStatus('已停止', false);
            this.stopLipSync();
        }
    }
    
    // 清理语音合成状态
    cleanup() {
        this.stopSpeaking();
        this.hide();
    }
    
    // 开始口型同步
    startLipSync() {
        if (this.player) {
            try {
                // 设置动画播放速度
                this.player.setSpeed(1.2);
                
                // 可以在这里添加更复杂的口型同步逻辑
            } catch (error) {
                console.warn('口型同步设置失败:', error);
            }
        }
    }
    
    // 停止口型同步
    stopLipSync() {
        if (this.player) {
            try {
                // 恢复正常播放速度
                this.player.setSpeed(1.0);
            } catch (error) {
                console.warn('口型同步停止失败:', error);
            }
        }
    }
    
    // 朗读场景内容
    speakScenario(scenario) {
        const text = `${scenario.description}。${scenario.situation}`;
        this.speak(text);
    }
    
    // 朗读选项
    speakChoices(choices) {
        const text = choices.map((choice, index) => 
            `选项${index + 1}：${choice.text}`
        ).join('。');
        this.speak(text);
    }
    
    // 朗读结果
    speakResult(choice) {
        const choiceText = `你选择了：${choice.text}`;
        const feedbackText = choice.feedback;
        const text = `${choiceText}。${feedbackText}`;
        this.speak(text);
    }
}

// 等待页面加载完成后创建全局实例
document.addEventListener('DOMContentLoaded', () => {
    // 检查浏览器支持情况
    if (!window.speechSynthesis) {
        console.warn('浏览器不支持Web Speech API，数字人朗读功能将不可用');
        return;
    }
    
    // 创建全局实例
    window.digitalHuman = new DigitalHuman();
}); 