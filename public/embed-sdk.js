(() => { 'use strict'; let e = () => { let e = navigator.userAgent; return /android.*mobile|iphone|ipod|blackberry|iemobile|opera mini|harmonyos/i.test(e); }; let t = 16 / 9; let i = (...e) => { for (let t of e) { if (t != null) return t;
} return ''; }; class n {config; detail = null; containerElement = null; styles; typewriterTimeoutId = null; typewriterCompleted = !1; speechBubbleElement = null; chatButtonElement = null; hoverChatButtonElement = null; isShowSpeechBubble = !0; scrollHandler = null; scrollTriggered = !1; currentScrollElement = null; constructor(e, t) { this.config = e, this.detail = t; }updateDetail(e) { this.detail = e, e && this.styles.updateDetail(e); }startConversation() { this.hide(), this.onToggle(); }create(e) { this.config.triggerConfig && (this.onToggle = e, this.containerElement = document.createElement('div'), this.containerElement.className = 'embed-sdk-normal-trigger', this.containerElement.style.cssText = this.getContainerStyles(), this.render(), document.body.appendChild(this.containerElement)); }show() { this.containerElement && (this.containerElement.style.visibility = 'visible'), this.showSpeechBubble(), this.isShowSpeechBubble = !0; }hide() { this.containerElement && (this.containerElement.style.visibility = 'hidden'), this.hideSpeechBubble(), this.isShowSpeechBubble = !1; }destroy() { this.unbind(), this.removeScrollListener(), this.containerElement && (document.body.removeChild(this.containerElement), this.containerElement = null), this.chatButtonElement = null, this.hoverChatButtonElement = null; }onToggle() {}getContainerStyles() { let e = (this.config.renderConfig?.zIndex || 9999) + 1; let t = this.config.triggerConfig?.position || 'bottom-right'; let i = Object.entries(this.config.triggerConfig?.style || {}); return `
            position: fixed;
            z-index: ${e};
            ${t === 'top-right' || t === 'top-left' ? 'top: 200px;' : 'bottom: 0;'}
            ${t === 'bottom-right' || t === 'top-right' ? 'right: 0px;' : 'left: 24px;'}
            ${i.map(([e, t]) => `${e}: ${t};`).join('')}
            }
        `; }

generateChatButtonHTML(e, t, i) { let n = i || this.getChatButtonText(); return `<div class="${e}" style="${t}">${n}</div>`; }generateSpeechBubbleHTML(e) { let t = e.emptyInitial ? '' : e.text || this.getSpeechBubbleText(); let i = e.className || 'embed-sdk-speech-bubble'; return `<div class="${i}" style="${e.style}">${t}</div>`; }getChatButtonText() { let e = this.detail?.employee.multilingualEnabled; let t = this.detail?.employee.multilingualConfig?.defaultLanguage; return e && t ? t === 'zh' ? '和我聊聊' : 'Talk to Me' : '和我聊聊'; }getSpeechBubbleText() { let e = this.detail?.employee.multilingualEnabled; let t = this.detail?.employee.multilingualConfig?.defaultLanguage; return e && t ? t === 'zh' ? '您好 \uD83D\uDC4B 有问题可以随时找我~' : 'Hello \uD83D\uDC4B Feel free to ask me anything~' : '您好 \uD83D\uDC4B 有问题可以随时找我~'; }getHoverSpeechBubbleText() { let e = this.detail?.employee.multilingualEnabled; let t = this.detail?.employee.multilingualConfig?.defaultLanguage; return e && t ? t === 'zh' ? '请问有什么可以帮您的～' : 'What can I help you with?' : '请问有什么可以帮您的～'; }startTypewriterEffect(e) { let { element: t, text: i, delay: n = 50, onComplete: s } = e; this.stopTypewriterEffect(), this.typewriterCompleted = !1, this.speechBubbleElement = t, t.textContent = '', t.style.visibility = 'hidden'; let r = Array.from(i); let o = 0; let l = !0; let h = () => { o < r.length ? (l && (t.style.visibility = this.isShowSpeechBubble ? 'visible' : 'hidden', l = !1), t.textContent = r.slice(0, o + 1).join(''), o++, this.typewriterTimeoutId = window.setTimeout(h, n)) : (this.typewriterCompleted = !0, this.typewriterTimeoutId = null, s && s()); }; h(); }stopTypewriterEffect() { this.typewriterTimeoutId !== null && (clearTimeout(this.typewriterTimeoutId), this.typewriterTimeoutId = null), this.typewriterCompleted = !1; }animateScaleIn(e, t) { let { fromScale: i = 0.85, toScale: n = 1, duration: s = 250 } = t || {}; e.style.transform = `scale(${i})`, e.style.opacity = '0', requestAnimationFrame(() => { requestAnimationFrame(() => { e.style.transition = `transform ${s}ms ease-out, opacity ${s}ms ease-out`, e.style.transform = `scale(${n})`, e.style.opacity = '1'; }); }); }handleHoverChatButtonMouseEnter = () => { this.hoverChatButtonElement && (this.hoverChatButtonElement.style.background = 'linear-gradient(241deg, #614DF0 14%, #005AF0 91.2%)'); }; handleHoverChatButtonMouseLeave = () => { this.hoverChatButtonElement && (this.hoverChatButtonElement.style.cssText = this.styles.getHoverChatButtonStyles()); }; hideSpeechBubble(e) { let t = e || this.speechBubbleElement; t && (t.style.display = 'none'); }showSpeechBubble(t) { let i = t || this.speechBubbleElement; i && !e() && (i.style.display = 'block', i.style.visibility = 'visible'); }unbind() {}setupScrollListener(e, t = 200) { if (this.scrollTriggered) return; let i = this.config.triggerConfig?.scrollElementId; let n = document.documentElement; if (i) { let e = document.getElementById(i); e ? n = e : console.warn(`Scroll element with id "${i}" not found, using document.documentElement as fallback`); } this.currentScrollElement = n, this.scrollHandler = () => { (n === document.documentElement ? window.scrollY || document.documentElement.scrollTop : n.scrollTop) >= t && !this.scrollTriggered && (this.scrollTriggered = !0, e(), this.removeScrollListener()); }, n === document.documentElement ? window.addEventListener('scroll', this.scrollHandler, { passive: !0 }) : n.addEventListener('scroll', this.scrollHandler, { passive: !0 }); }removeScrollListener() { this.scrollHandler && this.currentScrollElement && (this.currentScrollElement === document.documentElement ? window.removeEventListener('scroll', this.scrollHandler) : this.currentScrollElement.removeEventListener('scroll', this.scrollHandler), this.scrollHandler = null, this.currentScrollElement = null); }} class s {config; detail; constructor(e, t) { this.config = e, this.detail = t; } get isChinese() { let e = this.detail?.employee.multilingualEnabled; let t = this.detail?.employee.multilingualConfig?.defaultLanguage; return !e || !t || t === 'zh'; }getHoverChatButtonHoverStyles() { return `
            background: linear-gradient(241deg, #614DF0 14%, #005AF0 91.2%);
        `; }

updateDetail(e) { this.detail = e; }} class r extends s {getCompactPreviewStyles() { let e = this.config.triggerConfig?.position || 'bottom-right'; return `
            position: absolute;
            ${e === 'top-right' || e === 'top-left' ? 'top: 40px;' : 'bottom: 5px;'}
            ${e === 'bottom-right' || e === 'top-right' ? 'right: 5px;' : 'left: 30px;'}
            width: 100px;
            height: 129px;
        `; }

getMediaWrapperStyles() { return `
            width: 100px;
            height: 129px;
            border-radius: 0 0 50px 50px;
            overflow: hidden;
            position: absolute;
            bottom: 0;
        `; }

getMediaWrapperAfterStyles() { return `
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100px;
            height: 100px;
            border-radius: 50px;
            z-index: 0;
            border: 0.5px solid rgba(242, 242, 244, 1);
            box-sizing: border-box;
            background: radial-gradient(84.38% 85% at 50% 85%, #CFCFCF 0%, #E9EAF5 100%);
        `; }

getAvatarMediaStyles() { return `
            z-index: 1;
            width: 100px;
            height: 120px;
            object-fit: cover;
            position: absolute;
            bottom: 0;
        `; }

getChatButtonStyles() { return `
            position: absolute;
            bottom: 0;
            right: 50%;
            transform: translateX(50%);
            color: #fff;
            border-radius: 16px;
            padding: 6px 10px;
            cursor: pointer;
            z-index: 10;
            transition: all 0.2s ease;
            user-select: none;
            border: none;
            outline: none;
            white-space: nowrap;
            background: linear-gradient(238deg, #A64FFE -16.46%, #0060FF 90.43%);
            font-family: PingFang SC, sans-serif;
            font-weight: 500;
            font-size: 14px;
            text-align: center;
        `; }

getSpeechBubbleStyles() { let e = this.config.triggerConfig?.position || 'bottom-right'; let t = e === 'bottom-right' || e === 'top-right'; let i = this.isChinese ? '220px' : '270px'; return `
            position: absolute;
            ${t ? `left: -${i};` : `right: -${i};`};
            bottom: 12px;
            background: #fff;
            border-radius: ${t ? '18px 4px 18px 18px' : '4px 18px 18px 18px'};
            padding: 8px 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            z-index: 10;
            line-height: 20px;
            color: #333;
            display: block;
            text-align: center;
            font-family: PingFang SC, sans-serif;
            font-weight: 600;
            font-size: 14px;
        `; }

getHoverPreviewStyles() { let e = this.config.triggerConfig?.position || 'bottom-right'; return `
            position: absolute;
            width: 280px;
            height: 340px;
            ${e === 'top-right' || e === 'top-left' ? 'top: 0;' : 'bottom: 0;'}
            ${e === 'bottom-right' || e === 'top-right' ? 'right: 0;' : 'left: 0;'}
        `; }

getHoverMediaStyles() { return `
            object-fit: cover;
            width: 260px;
            height: 340px;
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
        `; }

getHoverChatButtonStyles() { return `
            position: absolute;
            bottom: 24px;
            right: 50%;
            transform: translateX(50%);
            color: #fff;
            border-radius: 41px;
            padding: 12px 24px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            z-index: 10;
            transition: all 0.2s ease;
            user-select: none;
            border: none;
            outline: none;
            white-space: nowrap;
            background: linear-gradient(238deg, #A64FFE -16.46%, #0060FF 90.43%);
        `; }

getHoverSpeechBubbleStyles(e) { let t = this.config.triggerConfig?.position || 'bottom-right'; let i = t === 'bottom-right' || t === 'top-right'; let n = e ? '190px' : '160px'; return `
            position: absolute;
            ${i ? `left: -${n};` : `right: -${n};`}
            bottom: 80px;
            background: #fff;
            border-radius: ${i ? '28px 8px 28px 28px;' : '8px 28px 28px 28px'};
            padding: 16px 24px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            z-index: 10;
            font-weight: 600;
            font-size: 18px;
            line-height: 20px;
            color: #333;
            display: block;
            text-align: center;
        `; }} class o extends n {videoSources; isHovering = !1; videoEnded = !1; firstInteractionVideo = null; hoverVideo = null; silentVideo = null; wrapperElement = null; constructor(e, t, i) { super(e, t), this.videoSources = i, this.styles = new r(e, t); }create(e) { this.config.triggerConfig && (this.onToggle = e, this.containerElement = document.createElement('div'), this.containerElement.className = 'embed-sdk-normal-trigger', this.containerElement.style.cssText = this.getContainerStyles(), this.render(), document.body.appendChild(this.containerElement), this.setupScrollListener(() => { this.isHovering = !0, this.render(); })); }destroy() { this.stopTypewriterEffect(), super.destroy(), this.firstInteractionVideo = null, this.hoverVideo = null, this.silentVideo = null, this.wrapperElement = null; }render() { this.containerElement && (this.containerElement.innerHTML = '', this.renderEmbedTriggerHover(), this.isHovering ? this.renderEmbedTriggerHover() : this.renderCompactAvatarPreview()); }unbind() { this.wrapperElement && (this.wrapperElement.removeEventListener('mouseenter', this.handleMouseEnter), this.wrapperElement = null), this.chatButtonElement && (this.chatButtonElement.removeEventListener('click', this.handleStartClick), this.chatButtonElement = null), this.hoverChatButtonElement && (this.hoverChatButtonElement.removeEventListener('click', this.handleStartClick), this.hoverChatButtonElement.removeEventListener('mouseenter', this.handleHoverChatButtonMouseEnter), this.hoverChatButtonElement.removeEventListener('mouseleave', this.handleHoverChatButtonMouseLeave), this.hoverChatButtonElement = null), this.firstInteractionVideo && (this.firstInteractionVideo.removeEventListener('ended', this.handleVideoEnded), this.firstInteractionVideo = null), this.hoverVideo && (this.hoverVideo.removeEventListener('ended', this.handleHoverVideoEnded), this.hoverVideo = null); }renderCompactAvatarPreview() { if (!this.containerElement) return; let e = this.createCompactAvatarPreviewHTML(); this.containerElement.innerHTML = e, this.firstInteractionVideo = this.containerElement.querySelector('.embed-sdk-first-interaction-video'), this.silentVideo = this.containerElement.querySelector('.embed-sdk-silent-video'); let t = this.containerElement.querySelector('.embed-sdk-speech-bubble'); if (t && !t.textContent && (t.style.visibility = 'hidden'), this.wrapperElement = this.containerElement.querySelector('.embed-sdk-compact-preview-wrapper'), this.wrapperElement && this.wrapperElement.addEventListener('mouseenter', this.handleMouseEnter), this.chatButtonElement = this.containerElement.querySelector('.embed-sdk-chat-button'), this.chatButtonElement && this.chatButtonElement.addEventListener('click', this.handleStartClick), this.firstInteractionVideo) { let e = () => { if (t) { let e = this.getSpeechBubbleText(); this.startTypewriterEffect({ element: t, text: e }); } this.firstInteractionVideo?.removeEventListener('play', e); }; if (this.firstInteractionVideo.addEventListener('play', e), this.firstInteractionVideo.readyState >= 2 && t) { let e = this.getSpeechBubbleText(); this.startTypewriterEffect({ element: t, text: e }); } this.firstInteractionVideo.addEventListener('ended', this.handleVideoEnded); } }renderEmbedTriggerHover() { if (!this.containerElement) return; let e = this.createEmbedTriggerHoverHTML(); this.containerElement.innerHTML = e; let t = this.containerElement.firstElementChild; t && this.animateScaleIn(t), this.hoverVideo = this.containerElement.querySelector('.embed-sdk-hover-video'); let i = this.containerElement.querySelector('.embed-sdk-speech-bubble'); if (i && !i.textContent && (i.style.visibility = 'hidden'), this.hoverChatButtonElement = this.containerElement.querySelector('.embed-sdk-hover-chat-button'), this.hoverChatButtonElement && (this.hoverChatButtonElement.addEventListener('click', this.handleStartClick), this.hoverChatButtonElement.addEventListener('mouseenter', this.handleHoverChatButtonMouseEnter), this.hoverChatButtonElement.addEventListener('mouseleave', this.handleHoverChatButtonMouseLeave)), this.hoverVideo) { let e = () => { if (i) { let e = this.getHoverSpeechBubbleText(); this.startTypewriterEffect({ element: i, text: e }); } this.hoverVideo?.removeEventListener('play', e); }; if (this.hoverVideo.addEventListener('play', e), this.hoverVideo.readyState >= 2 && i) { let e = this.getHoverSpeechBubbleText(); this.startTypewriterEffect({ element: i, text: e }); } this.hoverVideo.addEventListener('ended', this.handleHoverVideoEnded); } }createCompactAvatarPreviewHTML() { let { silentVideoSrc: e, firstInteractionVideoSrc: t } = this.videoSources; let i = this.videoEnded ? '' : this.generateSpeechBubbleHTML({ style: this.styles.getSpeechBubbleStyles(), emptyInitial: !0 }); let n = this.videoEnded
  ? ''
  : `
            <video
                        class="embed-sdk-first-interaction-video"
                        src="${t}"
                        autoplay
                        muted
                        playsinline
                        style="${this.styles.getAvatarMediaStyles()}; 
                            opacity: ${+!this.videoEnded}; 
                            transition: opacity 0.3s ease;"
                    ></video>
        `;return `
            <div class="embed-sdk-compact-preview-wrapper" style="${this.styles.getCompactPreviewStyles()}">
                <div style="${this.styles.getMediaWrapperStyles()}">
                    <div style="${this.styles.getMediaWrapperAfterStyles()}"></div>
                    <video
                        class="embed-sdk-silent-video"
                        src="${e}"
                        autoplay
                        loop
                        muted
                        playsinline
                        style="${this.styles.getAvatarMediaStyles()}; 
                            opacity: ${+!!this.videoEnded}; 
                            transition: opacity 0.3s ease;"
                    ></video>
                    ${n}
                </div>
                ${this.generateChatButtonHTML('embed-sdk-chat-button', this.styles.getChatButtonStyles())}
                ${i}
            </div>
        `; }

createEmbedTriggerHoverHTML() { let { hoverVideoSrc: e } = this.videoSources; let t = this.generateSpeechBubbleHTML({ style: this.styles.getHoverSpeechBubbleStyles(), emptyInitial: !0, text: this.getHoverSpeechBubbleText() }); return `
            <div style="${this.styles.getHoverPreviewStyles()}">
                <video
                    class="embed-sdk-hover-video"
                    src="${e}"
                    autoplay
                    muted
                    playsinline
                    style="${this.styles.getHoverMediaStyles()}; z-index: 10;
                        transition: opacity 0.3s ease;"
                ></video>
                ${this.generateChatButtonHTML('embed-sdk-hover-chat-button', this.styles.getHoverChatButtonStyles())}
                ${t}
            </div>
        `; }

handleMouseEnter = () => { this.isHovering = !0, this.render(); }; handleVideoEnded = () => { if (this.videoEnded = !0, this.firstInteractionVideo && (this.firstInteractionVideo.style.opacity = '0'), this.silentVideo && (this.silentVideo.style.opacity = '1'), this.typewriterCompleted) { this.hideSpeechBubble();
} else { let e = () => { this.typewriterCompleted ? this.hideSpeechBubble() : setTimeout(e, 50); }; e(); } };

handleHoverVideoEnded = () => { if (this.isHovering = !1, this.typewriterCompleted) { this.hideSpeechBubble();
} else { let e = () => { this.typewriterCompleted ? this.hideSpeechBubble() : setTimeout(e, 50); }; e(); } this.render(); };

handleStartClick = () => { this.startConversation(); };} class l extends n {videoSources; isHovering = !1; videoEnded = !1; wrapperElement = null; videoElement = null; constructor(e, t, i) { super(e, t), this.videoSources = i, this.styles = new r(e, t); }create(e) { this.config.triggerConfig && (this.onToggle = e, this.containerElement = document.createElement('div'), this.containerElement.className = 'embed-sdk-enhanced-trigger', this.containerElement.style.cssText = this.getContainerStyles(), this.render(), document.body.appendChild(this.containerElement)); }destroy() { this.stopTypewriterEffect(), super.destroy(), this.wrapperElement = null, this.videoElement = null; }render() { this.containerElement && (this.containerElement.innerHTML = '', this.videoEnded ? this.isHovering ? this.renderEmbedTriggerHover(!1) : this.renderCompactAvatarPreview() : this.renderEmbedTriggerHover(!0)); }unbind() { this.wrapperElement && (this.wrapperElement.removeEventListener('mouseenter', this.handleMouseEnter), this.wrapperElement = null), this.chatButtonElement && (this.chatButtonElement.removeEventListener('click', this.handleStartClick), this.chatButtonElement = null), this.hoverChatButtonElement && (this.hoverChatButtonElement.removeEventListener('click', this.handleStartClick), this.hoverChatButtonElement.removeEventListener('mouseenter', this.handleHoverChatButtonMouseEnter), this.hoverChatButtonElement.removeEventListener('mouseleave', this.handleHoverChatButtonMouseLeave), this.hoverChatButtonElement = null), this.videoElement && (this.videoElement.removeEventListener('ended', this.handleVideoEnded), this.videoElement.removeEventListener('ended', this.handleHoverVideoEnded), this.videoElement = null); }renderCompactAvatarPreview() { if (!this.containerElement) return; let e = this.createCompactAvatarPreviewHTML(); this.containerElement.innerHTML = e, this.wrapperElement = this.containerElement.querySelector('.embed-sdk-compact-preview-wrapper'), this.wrapperElement && this.wrapperElement.addEventListener('mouseenter', this.handleMouseEnter), this.chatButtonElement = this.containerElement.querySelector('.embed-sdk-chat-button'), this.chatButtonElement && this.chatButtonElement.addEventListener('click', this.handleStartClick); }renderEmbedTriggerHover(e) { if (!this.containerElement) return; let t = this.createEmbedTriggerHoverHTML(e); this.containerElement.innerHTML = t; let i = this.containerElement.firstElementChild; i && !e && this.animateScaleIn(i), this.videoElement = this.containerElement.querySelector('.embed-sdk-hover-video'); let n = this.containerElement.querySelector('.embed-sdk-speech-bubble'); if (n && !n.textContent && (n.style.visibility = 'hidden'), this.hoverChatButtonElement = this.containerElement.querySelector('.embed-sdk-hover-chat-button'), this.hoverChatButtonElement && (this.hoverChatButtonElement.addEventListener('click', this.handleStartClick), this.hoverChatButtonElement.addEventListener('mouseenter', this.handleHoverChatButtonMouseEnter), this.hoverChatButtonElement.addEventListener('mouseleave', this.handleHoverChatButtonMouseLeave)), this.videoElement) { let t = () => { if (n) { let t = e ? this.getSpeechBubbleText() : this.getHoverSpeechBubbleText(); this.startTypewriterEffect({ element: n, text: t }); } this.videoElement?.removeEventListener('play', t); }; if (this.videoElement.addEventListener('play', t), this.videoElement.readyState >= 2 && n) { let t = e ? this.getSpeechBubbleText() : this.getHoverSpeechBubbleText(); this.startTypewriterEffect({ element: n, text: t }); }e ? this.videoElement.addEventListener('ended', this.handleVideoEnded) : this.videoElement.addEventListener('ended', this.handleHoverVideoEnded); } }createCompactAvatarPreviewHTML() { let { silentVideoSrc: e } = this.videoSources; return `
            <div class="embed-sdk-compact-preview-wrapper" style="${this.styles.getCompactPreviewStyles()}">
                <div style="${this.styles.getMediaWrapperStyles()}">
                    <div style="${this.styles.getMediaWrapperAfterStyles()}"></div>
                    <video
                        src="${e}"
                        autoplay
                        loop
                        muted
                        playsinline
                        style="${this.styles.getAvatarMediaStyles()}"
                    ></video>
                </div>
                ${this.generateChatButtonHTML('embed-sdk-chat-button', this.styles.getChatButtonStyles())}
            </div>
        `; }

createEmbedTriggerHoverHTML(e) { let { firstInteractionVideoSrc: t, hoverVideoSrc: i } = this.videoSources; let n = e ? t : i; let s = this.generateSpeechBubbleHTML({ style: this.styles.getHoverSpeechBubbleStyles(e), emptyInitial: !0, text: this.getHoverSpeechBubbleText() }); return `
            <div style="${this.styles.getHoverPreviewStyles()}">
                <video
                    class="embed-sdk-hover-video"
                    src="${n}"
                    autoplay
                    muted
                    playsinline
                    style="${this.styles.getHoverMediaStyles()}; z-index: 10;"
                ></video>
                ${this.generateChatButtonHTML('embed-sdk-hover-chat-button', this.styles.getHoverChatButtonStyles())}
                ${s}
            </div>
        `; }

handleMouseEnter = () => { this.isHovering = !0, this.render(); }; handleVideoEnded = () => { if (this.videoEnded = !0, this.typewriterCompleted) { this.hideSpeechBubble();
} else { let e = () => { this.typewriterCompleted ? this.hideSpeechBubble() : setTimeout(e, 50); }; e(); } this.render(); };

handleHoverVideoEnded = () => { if (this.isHovering = !1, this.typewriterCompleted) { this.hideSpeechBubble();
} else { let e = () => { this.typewriterCompleted ? this.hideSpeechBubble() : setTimeout(e, 50); }; e(); } this.render(); };

handleStartClick = () => { this.startConversation(); };} class h extends s {getCompactPreviewStyles() { let e = this.config.triggerConfig?.position || 'bottom-right'; return `
            position: absolute;
            ${e === 'top-right' || e === 'top-left' ? 'top: 40px;' : 'bottom: 100px;'}
            ${e === 'bottom-right' || e === 'top-right' ? 'right: 30px;' : 'left: 30px;'}
            width: 100px;
            height: 100px;
        `; }

getMediaWrapperStyles() { return `
            width: 100px;
            height: 100px;
            position: relative;
        `; }

getMediaWrapperAfterStyles() { return `
            display: none;
        `; }

getAvatarMediaStyles() { return `
            z-index: 1;
            width: 100px;
            height: 100px;
            object-fit: cover;
            object-position: top;
            position: absolute;
            bottom: 0;
            border-radius: 50%;
        `; }

getChatButtonStyles() { return `
            position: absolute;
            bottom: 0;
            right: 50%;
            transform: translateX(50%);
            color: #fff;
            border-radius: 16px;
            padding: 6px 10px;
            cursor: pointer;
            z-index: 10;
            transition: all 0.2s ease;
            user-select: none;
            border: none;
            outline: none;
            white-space: nowrap;
            background: linear-gradient(238deg, #A64FFE -16.46%, #0060FF 90.43%);
            font-family: PingFang SC, sans-serif;
            font-weight: 500;
            font-size: 14px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
        `; }

getSpeechBubbleStyles() { let e = this.config.triggerConfig?.position || 'bottom-right'; let t = e === 'bottom-right' || e === 'top-right'; let i = this.isChinese ? '220px' : '270px'; return `
            position: absolute;
            ${t ? `left: -${i};` : `right: -${i};`};
            bottom: 12px;
            background: #fff;
            border-radius: ${t ? '18px 4px 18px 18px' : '4px 18px 18px 18px'};
            padding: 8px 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            z-index: 10;
            line-height: 20px;
            color: #333;
            display: block;
            text-align: center;
            font-family: PingFang SC, sans-serif;
            font-weight: 600;
            font-size: 14px;
        `; }

getHoverPreviewStyles() { let e = this.config.triggerConfig?.position || 'bottom-right'; return `
            position: absolute;
            width: 225px;
            height: 300px;
            box-sizing: border-box;
            ${e === 'top-right' || e === 'top-left' ? 'top: 8px;' : 'bottom: 8px;'}
            ${e === 'bottom-right' || e === 'top-right' ? 'right: 12px;' : 'left: 12px;'}
        `; }

getHoverMediaStyles() { return `
            object-fit: cover;
            width: 225px;
            height: 300px;
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            border-radius: 16px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
            border: 4px solid rgba(255, 255, 255, 1);
            box-sizing: border-box;
        `; }

getHoverChatButtonStyles() { return `
            position: absolute;
            bottom: 24px;
            right: 50%;
            transform: translateX(50%);
            color: #fff;
            border-radius: 41px;
            padding: 12px 24px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            z-index: 10;
            transition: all 0.2s ease;
            user-select: none;
            border: none;
            outline: none;
            white-space: nowrap;
            background: linear-gradient(240deg, #A64FFE -15.52%, #0060FF 90.74%);
        `; }

getHoverSpeechBubbleStyles(e) { let t = this.config.triggerConfig?.position || 'bottom-right'; let i = t === 'bottom-right' || t === 'top-right'; let n = e ? 230 : 200; let s = this.isChinese ? `${n}px` : `${n + 50}px`; return `
            position: absolute;
            ${i ? `left: -${s};` : `right: -${s};`};
            bottom: 80px;
            background: #fff;

            border-radius: ${i ? '28px 8px 28px 28px;' : '8px 28px 28px 28px'};
            padding: 16px 24px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            z-index: 10;
            font-weight: 600;
            font-size: 18px;
            line-height: 20px;
            color: #333;
            display: block;
            text-align: center;
        `; }} class a extends n {videoSources; isHovering = !1; videoEnded = !1; firstInteractionVideo = null; hoverVideo = null; wrapperElement = null; constructor(e, t, i) { super(e, t), this.videoSources = i, this.styles = new h(e, t); }create(e) { this.config.triggerConfig && (this.onToggle = e, this.containerElement = document.createElement('div'), this.containerElement.className = 'embed-sdk-custom-normal-trigger', this.containerElement.style.cssText = this.getContainerStyles(), this.render(), document.body.appendChild(this.containerElement), this.setupScrollListener(() => { this.isHovering = !0, this.render(); })); }destroy() { this.stopTypewriterEffect(), super.destroy(), this.firstInteractionVideo = null, this.hoverVideo = null, this.wrapperElement = null; }render() { this.containerElement && (this.containerElement.innerHTML = '', this.isHovering ? this.renderEmbedTriggerHover() : this.renderCompactAvatarPreview()); }unbind() { this.wrapperElement && (this.wrapperElement.removeEventListener('mouseenter', this.handleMouseEnter), this.wrapperElement = null), this.chatButtonElement && (this.chatButtonElement.removeEventListener('click', this.handleStartClick), this.chatButtonElement = null), this.hoverChatButtonElement && (this.hoverChatButtonElement.removeEventListener('click', this.handleStartClick), this.hoverChatButtonElement.removeEventListener('mouseenter', this.handleHoverChatButtonMouseEnter), this.hoverChatButtonElement.removeEventListener('mouseleave', this.handleHoverChatButtonMouseLeave), this.hoverChatButtonElement = null), this.firstInteractionVideo && (this.firstInteractionVideo.removeEventListener('ended', this.handleVideoEnded), this.firstInteractionVideo = null), this.hoverVideo && (this.hoverVideo.removeEventListener('ended', this.handleHoverVideoEnded), this.hoverVideo = null); }renderCompactAvatarPreview() { if (!this.containerElement) return; let e = this.createCompactAvatarPreviewHTML(); this.containerElement.innerHTML = e, this.firstInteractionVideo = this.containerElement.querySelector('.embed-sdk-custom-first-interaction-video'); let t = this.containerElement.querySelector('.embed-sdk-custom-speech-bubble'); if (t && !t.textContent && (t.style.visibility = 'hidden'), this.wrapperElement = this.containerElement.querySelector('.embed-sdk-custom-compact-preview-wrapper'), this.wrapperElement && this.wrapperElement.addEventListener('mouseenter', this.handleMouseEnter), this.chatButtonElement = this.containerElement.querySelector('.embed-sdk-custom-chat-button'), this.chatButtonElement && this.chatButtonElement.addEventListener('click', this.handleStartClick), this.firstInteractionVideo) { let e = () => { if (t) { let e = this.getSpeechBubbleText(); this.startTypewriterEffect({ element: t, text: e }); } this.firstInteractionVideo?.removeEventListener('play', e); }; if (this.firstInteractionVideo.addEventListener('play', e), this.firstInteractionVideo.readyState >= 2 && t) { let e = this.getSpeechBubbleText(); this.startTypewriterEffect({ element: t, text: e }); } this.firstInteractionVideo.addEventListener('ended', this.handleVideoEnded); } }renderEmbedTriggerHover() { if (!this.containerElement) return; let e = this.createEmbedTriggerHoverHTML(); this.containerElement.innerHTML = e; let t = this.containerElement.firstElementChild; t && this.animateScaleIn(t), this.hoverVideo = this.containerElement.querySelector('.embed-sdk-custom-hover-video'); let i = this.containerElement.querySelector('.embed-sdk-custom-hover-speech-bubble'); if (i && !i.textContent && (i.style.visibility = 'hidden'), this.hoverChatButtonElement = this.containerElement.querySelector('.embed-sdk-custom-hover-chat-button'), this.hoverChatButtonElement && (this.hoverChatButtonElement.addEventListener('click', this.handleStartClick), this.hoverChatButtonElement.addEventListener('mouseenter', this.handleHoverChatButtonMouseEnter), this.hoverChatButtonElement.addEventListener('mouseleave', this.handleHoverChatButtonMouseLeave)), this.hoverVideo) { let e = () => { if (i) { let e = this.getHoverSpeechBubbleText(); this.startTypewriterEffect({ element: i, text: e }); } this.hoverVideo?.removeEventListener('play', e); }; if (this.hoverVideo.addEventListener('play', e), this.hoverVideo.readyState >= 2 && i) { let e = this.getHoverSpeechBubbleText(); this.startTypewriterEffect({ element: i, text: e }); } this.hoverVideo.addEventListener('ended', this.handleHoverVideoEnded); } }createCompactAvatarPreviewHTML() { let { silentVideoSrc: e, firstInteractionVideoSrc: t } = this.videoSources; let i = this.videoEnded ? '' : this.generateSpeechBubbleHTML({ style: this.styles.getSpeechBubbleStyles(), className: 'embed-sdk-custom-speech-bubble', emptyInitial: !0 }); let n = this.videoEnded
  ? ''
  : `
            <video
                class="embed-sdk-custom-first-interaction-video"
                src="${t}"
                autoplay
                muted
                playsinline
                style="${this.styles.getAvatarMediaStyles()}; 
                    opacity: ${+!this.videoEnded}; 
                    transition: opacity 0.3s ease;"
            ></video>
        `;return `
            <div class="embed-sdk-custom-compact-preview-wrapper" style="${this.styles.getCompactPreviewStyles()}">
                <video
                    src="${e}"
                    autoplay
                    loop
                    muted
                    playsinline
                    style="${this.styles.getAvatarMediaStyles()}"
                ></video>
                ${n}
                ${this.generateChatButtonHTML('embed-sdk-custom-chat-button', this.styles.getChatButtonStyles())}
                ${i}
            </div>
        `; }

createEmbedTriggerHoverHTML() { let { hoverVideoSrc: e } = this.videoSources; return `
            <div style="${this.styles.getHoverPreviewStyles()}">
                <video
                    class="embed-sdk-custom-hover-video"
                    src="${e}"
                    autoplay
                    muted
                    playsinline
                    style="${this.styles.getHoverMediaStyles()}; z-index: 10;
                        transition: opacity 0.3s ease;"
                ></video>
                ${this.generateChatButtonHTML('embed-sdk-custom-hover-chat-button', this.styles.getHoverChatButtonStyles())}
                ${this.generateSpeechBubbleHTML({ style: this.styles.getHoverSpeechBubbleStyles(), className: 'embed-sdk-custom-hover-speech-bubble', emptyInitial: !0, text: this.getHoverSpeechBubbleText() })}
            </div>
        `; }

handleMouseEnter = () => { this.isHovering = !0, this.render(); }; handleVideoEnded = () => { if (this.videoEnded = !0, this.firstInteractionVideo && (this.firstInteractionVideo.style.opacity = '0'), this.typewriterCompleted) { this.hideSpeechBubble();
} else { let e = () => { this.typewriterCompleted ? this.hideSpeechBubble() : setTimeout(e, 50); }; e(); } };

handleHoverVideoEnded = () => { if (this.isHovering = !1, this.typewriterCompleted) { this.hideSpeechBubble();
} else { let e = () => { this.typewriterCompleted ? this.hideSpeechBubble() : setTimeout(e, 50); }; e(); } this.render(); };

handleStartClick = () => { this.startConversation(); };} class d extends n {videoSources; isHovering = !1; videoEnded = !1; wrapperElement = null; videoElement = null; constructor(e, t, i) { super(e, t), this.videoSources = i, this.styles = new h(e, t); }create(e) { this.config.triggerConfig && (this.onToggle = e, this.containerElement = document.createElement('div'), this.containerElement.className = 'embed-sdk-custom-enhanced-trigger', this.containerElement.style.cssText = this.getContainerStyles(), this.render(), document.body.appendChild(this.containerElement)); }destroy() { this.stopTypewriterEffect(), super.destroy(), this.wrapperElement = null, this.videoElement = null; }render() { this.containerElement && (this.containerElement.innerHTML = '', this.videoEnded ? this.isHovering ? this.renderEmbedTriggerHover(!1) : this.renderCompactAvatarPreview() : this.renderEmbedTriggerHover(!0)); }unbind() { this.wrapperElement && (this.wrapperElement.removeEventListener('mouseenter', this.handleMouseEnter), this.wrapperElement = null), this.chatButtonElement && (this.chatButtonElement.removeEventListener('click', this.handleStartClick), this.chatButtonElement = null), this.hoverChatButtonElement && (this.hoverChatButtonElement.removeEventListener('click', this.handleStartClick), this.hoverChatButtonElement.removeEventListener('mouseenter', this.handleHoverChatButtonMouseEnter), this.hoverChatButtonElement.removeEventListener('mouseleave', this.handleHoverChatButtonMouseLeave), this.hoverChatButtonElement = null), this.videoElement && (this.videoElement.removeEventListener('ended', this.handleVideoEnded), this.videoElement.removeEventListener('ended', this.handleHoverVideoEnded), this.videoElement = null); }renderCompactAvatarPreview() { if (!this.containerElement) return; let e = this.createCompactAvatarPreviewHTML(); this.containerElement.innerHTML = e, this.wrapperElement = this.containerElement.querySelector('.embed-sdk-custom-compact-preview-wrapper'), this.wrapperElement && this.wrapperElement.addEventListener('mouseenter', this.handleMouseEnter), this.chatButtonElement = this.containerElement.querySelector('.embed-sdk-custom-chat-button'), this.chatButtonElement && this.chatButtonElement.addEventListener('click', this.handleStartClick); }renderEmbedTriggerHover(e) { if (!this.containerElement) return; let t = this.createEmbedTriggerHoverHTML(e); this.containerElement.innerHTML = t; let i = this.containerElement.firstElementChild; i && !e && this.animateScaleIn(i), this.videoElement = this.containerElement.querySelector('.embed-sdk-custom-hover-video'); let n = this.containerElement.querySelector('.embed-sdk-custom-speech-bubble'); if (n && !n.textContent && (n.style.visibility = 'hidden'), this.hoverChatButtonElement = this.containerElement.querySelector('.embed-sdk-custom-hover-chat-button'), this.hoverChatButtonElement && (this.hoverChatButtonElement.addEventListener('click', this.handleStartClick), this.hoverChatButtonElement.addEventListener('mouseenter', this.handleHoverChatButtonMouseEnter), this.hoverChatButtonElement.addEventListener('mouseleave', this.handleHoverChatButtonMouseLeave)), this.videoElement) { let t = () => { if (n) { let t = e ? this.getSpeechBubbleText() : this.getHoverSpeechBubbleText(); this.startTypewriterEffect({ element: n, text: t }); } this.videoElement?.removeEventListener('play', t); }; if (this.videoElement.addEventListener('play', t), this.videoElement.readyState >= 2 && n) { let t = e ? this.getSpeechBubbleText() : this.getHoverSpeechBubbleText(); this.startTypewriterEffect({ element: n, text: t }); }e ? this.videoElement.addEventListener('ended', this.handleVideoEnded) : this.videoElement.addEventListener('ended', this.handleHoverVideoEnded); } }createCompactAvatarPreviewHTML() { let { silentVideoSrc: e } = this.videoSources; return `
            <div class="embed-sdk-custom-compact-preview-wrapper" style="${this.styles.getCompactPreviewStyles()}">
                <video
                    src="${e}"
                    autoplay
                    loop
                    muted
                    playsinline
                    style="${this.styles.getAvatarMediaStyles()}"
                ></video>
                ${this.generateChatButtonHTML('embed-sdk-custom-chat-button', this.styles.getChatButtonStyles())}
            </div>
        `; }

createEmbedTriggerHoverHTML(e) { let { firstInteractionVideoSrc: t, hoverVideoSrc: i } = this.videoSources; let n = e ? t : i; let s = this.generateChatButtonHTML('embed-sdk-custom-hover-chat-button', this.styles.getHoverChatButtonStyles()); let r = this.generateSpeechBubbleHTML({ style: this.styles.getHoverSpeechBubbleStyles(e), className: 'embed-sdk-custom-speech-bubble', emptyInitial: !0, text: this.getHoverSpeechBubbleText() }); return `
            <div style="${this.styles.getHoverPreviewStyles()}">
                <video
                    class="embed-sdk-custom-hover-video"
                    src="${n}"
                    autoplay
                    muted
                    playsinline
                    style="${this.styles.getHoverMediaStyles()}; z-index: 10;"
                ></video>
                ${s}
                ${r}
            </div>
        `; }

handleMouseEnter = () => { this.isHovering = !0, this.render(); }; handleVideoEnded = () => { if (this.videoEnded = !0, this.typewriterCompleted) { this.hideSpeechBubble();
} else { let e = () => { this.typewriterCompleted ? this.hideSpeechBubble() : setTimeout(e, 50); }; e(); } this.render(); };

handleHoverVideoEnded = () => { if (this.isHovering = !1, this.typewriterCompleted) { this.hideSpeechBubble();
} else { let e = () => { this.typewriterCompleted ? this.hideSpeechBubble() : setTimeout(e, 50); }; e(); } this.render(); };

handleStartClick = () => { this.startConversation(); };} class c extends s {getCompactPreviewStyles() { let e = this.config.triggerConfig?.position || 'bottom-right'; return `
            position: absolute;
            width: 72px;
            height: 86px;
            ${e === 'top-right' || e === 'top-left' ? 'top: 100px;' : 'bottom: 66px;'}
            ${e === 'bottom-right' || e === 'top-right' ? 'right: 24px;' : 'left: 24px;'}
        `; }

getMediaWrapperStyles() { return `
            position: relative;
            width: 72px;
            height: 86px;
            overflow: hidden;
        `; }

getMediaWrapperAfterStyles() { return `
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 72px;
            height: 72px;
            border-radius: 36px;
            z-index: 0;
            border: 0.5px solid rgba(242, 242, 244, 1);
            background: radial-gradient(84.38% 85% at 50% 85%, #CFCFCF 0%, #E9EAF5 100%);
        `; }

getAvatarMediaStyles() { return `
            object-fit: cover;
            width: 72px;
            height: 80px;
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
        `; }

getChatButtonStyles() { return `
            position: absolute;
            bottom: -12px;
            right: 50%;
            transform: translateX(50%);
            color: #fff;
            border-radius: 33px;
            padding: 4px 8px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            z-index: 10;
            transition: all 0.2s ease;
            user-select: none;
            border: none;
            outline: none;
            white-space: nowrap;
            background: linear-gradient(238deg, #A64FFE -16.46%, #0060FF 90.43%);
            font-family: PingFang SC, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            -webkit-tap-highlight-color: transparent;
        `; }

getSpeechBubbleStyles() { let e = this.config.triggerConfig?.position || 'bottom-right'; let t = e === 'bottom-right' || e === 'top-right'; let i = this.isChinese ? '170px' : '220px'; return `
            position: absolute;
            ${t ? `left: -${i};` : `right: -${i};`};
            bottom: 8px;
            background: #fff;
            border-radius: ${t ? '14px 4px 14px 14px' : '4px 14px 14px 14px'};
            padding: 6px 10px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
            z-index: 10;
            font-size: 12px;
            line-height: 16px;
            color: #333;
            display: block;
            text-align: center;
            font-weight: 600;
            font-family: PingFang SC, sans-serif;
        `; }

getHoverPreviewStyles() { let e = this.config.triggerConfig?.position || 'bottom-right'; return `
            position: absolute;
            width: 140px;
            height: 180px;
            ${e === 'top-right' || e === 'top-left' ? 'top: 0;' : 'bottom: 0;'}
            ${e === 'bottom-right' || e === 'top-right' ? 'right: 0;' : 'left: 0;'}
        `; }

getHoverMediaStyles() { return `
            object-fit: cover;
            width: 115px;
            height: 167px;
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
        `; }

getHoverChatButtonStyles() { return `
            position: absolute;
            bottom: 8px;
            right: 50%;
            transform: translateX(50%);
            color: #fff;
            border-radius: 20px;
            padding: 6px 12px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            z-index: 10;
            transition: all 0.2s ease;
            user-select: none;
            border: none;
            outline: none;
            white-space: nowrap;
            background: linear-gradient(238deg, #A64FFE -16.46%, #0060FF 90.43%);
            font-family: PingFang SC, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            -webkit-tap-highlight-color: transparent;
        `; }

getHoverSpeechBubbleStyles() { let e = this.config.triggerConfig?.position || 'bottom-right'; let t = e === 'bottom-right' || e === 'top-right'; let i = this.isChinese ? '160px' : '210px'; return `
            position: absolute;
            ${t ? `left: -${i};` : `right: -${i};`};
            bottom: 40px;
            background: #fff;
            border-radius: ${t ? '14px 4px 14px 14px' : '4px 14px 14px 14px'};
            padding: 6px 10px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            z-index: 10;
            font-size: 12px;
            line-height: 18px;
            color: #333;
            display: block;
            text-align: center;
            font-family: PingFang SC, sans-serif;
            font-weight: 600;
        `; }} class m extends n {imageSrc; constructor(e, t, i) { super(e, t), this.imageSrc = i, this.styles = new c(e, t); }create(e) { this.config.triggerConfig && (this.onToggle = e, this.containerElement = document.createElement('div'), this.containerElement.className = 'embed-sdk-enhanced-mobile-trigger', this.containerElement.style.cssText = this.getContainerStyles(), this.render(), document.body.appendChild(this.containerElement), this.initTypewriterEffect()); }destroy() { this.stopTypewriterEffect(), super.destroy(), this.speechBubbleElement = null; }render() { this.containerElement && (this.containerElement.innerHTML = '', this.renderEnhancedMobileView()); }unbind() { this.chatButtonElement && (this.chatButtonElement.removeEventListener('click', this.handleStartClick), this.chatButtonElement = null); }renderEnhancedMobileView() { if (!this.containerElement) return; let e = this.createEnhancedMobileViewHTML(); this.containerElement.innerHTML = e, this.chatButtonElement = this.containerElement.querySelector('.embed-sdk-enhanced-mobile-chat-button'), this.chatButtonElement && this.chatButtonElement.addEventListener('click', this.handleStartClick), this.speechBubbleElement = this.containerElement.querySelector('.embed-sdk-enhanced-mobile-speech-bubble'); }createEnhancedMobileViewHTML() { let e = this.generateChatButtonHTML('embed-sdk-enhanced-mobile-chat-button', this.styles.getHoverChatButtonStyles()); let t = this.generateSpeechBubbleHTML({ className: 'embed-sdk-enhanced-mobile-speech-bubble', style: this.styles.getHoverSpeechBubbleStyles(), emptyInitial: !0 }); return `
            <div class="embed-sdk-enhanced-mobile-preview" style="${this.styles.getHoverPreviewStyles()}">
                <img
                    class="embed-sdk-enhanced-mobile-image"
                    src="${this.imageSrc}"
                    alt="avatar"
                    style="${this.styles.getHoverMediaStyles()}"
                />
                ${e}
                ${t}
            </div>
        `; }

initTypewriterEffect() { setTimeout(() => { if (this.speechBubbleElement) { let e = this.getSpeechBubbleText(); this.startTypewriterEffect({ element: this.speechBubbleElement, text: e, onComplete: () => { setTimeout(() => { this.hideSpeechBubble(); }, 1e3); } }); } }, 300); }handleStartClick = () => { this.startConversation(); };} class p extends n {imageSrc; constructor(e, t, i) { super(e, t), this.imageSrc = i, this.styles = new c(e, t); }create(e) { this.config.triggerConfig && (this.onToggle = e, this.containerElement = document.createElement('div'), this.containerElement.className = 'embed-sdk-normal-mobile-trigger', this.containerElement.style.cssText = this.getContainerStyles(), this.render(), document.body.appendChild(this.containerElement), this.initTypewriterEffect()); }destroy() { this.stopTypewriterEffect(), super.destroy(), this.speechBubbleElement = null; }render() { this.containerElement && (this.containerElement.innerHTML = '', this.renderNormalMobileView()); }unbind() { this.chatButtonElement && (this.chatButtonElement.removeEventListener('click', this.handleStartClick), this.chatButtonElement = null); }renderNormalMobileView() { if (!this.containerElement) return; let e = this.createNormalMobileViewHTML(); this.containerElement.innerHTML = e, this.chatButtonElement = this.containerElement.querySelector('.embed-sdk-normal-mobile-chat-button'), this.chatButtonElement && this.chatButtonElement.addEventListener('click', this.handleStartClick), this.speechBubbleElement = this.containerElement.querySelector('.embed-sdk-normal-mobile-speech-bubble'); }createNormalMobileViewHTML() { let e = this.generateChatButtonHTML('embed-sdk-normal-mobile-chat-button', this.styles.getChatButtonStyles()); let t = this.generateSpeechBubbleHTML({ className: 'embed-sdk-normal-mobile-speech-bubble', style: this.styles.getSpeechBubbleStyles(), emptyInitial: !0 }); return `
            <div class="embed-sdk-normal-mobile-preview" style="${this.styles.getCompactPreviewStyles()}">
                <div class="embed-sdk-normal-mobile-media-wrapper" style="${this.styles.getMediaWrapperStyles()}">
                    <div style="${this.styles.getMediaWrapperAfterStyles()}"></div>
                    <img
                        class="embed-sdk-normal-mobile-image"
                        src="${this.imageSrc}"
                        alt="avatar"
                        style="${this.styles.getAvatarMediaStyles()}"
                    />
                </div>
                ${e}
                ${t}
            </div>
        `; }

initTypewriterEffect() { setTimeout(() => { if (this.speechBubbleElement) { let e = this.getSpeechBubbleText(); this.startTypewriterEffect({ element: this.speechBubbleElement, text: e, onComplete: () => { setTimeout(() => { this.hideSpeechBubble(); }, 1e3); } }); } }, 300); }handleStartClick = () => { this.startConversation(); };} class u extends s {getCompactPreviewStyles() { let e = this.config.triggerConfig?.position || 'bottom-right'; return `
            position: absolute;
            width: 72px;
            height: 72px;
            ${e === 'top-right' || e === 'top-left' ? 'top: 100px;' : 'bottom: 66px;'}
            ${e === 'bottom-right' || e === 'top-right' ? 'right: 24px;' : 'left: 24px;'}
        `; }

getMediaWrapperStyles() { return `
            position: relative;
            width: 72px;
            height: 72px;
        `; }

getMediaWrapperAfterStyles() { return `
            display: none;
        `; }

getAvatarMediaStyles() { return `
            object-fit: cover;
            width: 72px;
            height: 72px;
            position: absolute;
            bottom: 0;
            border-radius: 50%;
        `; }

getChatButtonStyles() { return `
            position: absolute;
            bottom: -12px;
            right: 50%;
            transform: translateX(50%);
            color: #fff;
            border-radius: 33px;
            padding: 4px 8px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            z-index: 10;
            transition: all 0.2s ease;
            user-select: none;
            border: none;
            outline: none;
            white-space: nowrap;
            background: linear-gradient(238deg, #A64FFE -16.46%, #0060FF 90.43%);
            font-family: PingFang SC, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            -webkit-tap-highlight-color: transparent;
        `; }

getSpeechBubbleStyles() { let e = this.config.triggerConfig?.position || 'bottom-right'; let t = e === 'bottom-right' || e === 'top-right'; let i = this.isChinese ? '180px' : '230px'; return `
            position: absolute;
            ${t ? `left: -${i};` : `right: -${i};`};
            bottom: 8px;
            background: #fff;
            border-radius: ${t ? '14px 4px 14px 14px' : '4px 14px 14px 14px'};
            padding: 6px 10px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
            z-index: 10;
            font-size: 12px;
            line-height: 16px;
            color: #333;
            display: block;
            text-align: center;
            font-weight: 600;
            font-family: PingFang SC, sans-serif;
        `; }

getHoverPreviewStyles() { let e = this.config.triggerConfig?.position || 'bottom-right'; return `
            position: absolute;
            width: 100px;
            height: 134px;
            ${e === 'top-right' || e === 'top-left' ? 'top: 200px;' : 'bottom: 40px;'}
            ${e === 'bottom-right' || e === 'top-right' ? 'right: 24px;' : 'left: 24px;'}
        `; }

getHoverMediaStyles() { return `
            object-fit: cover;
            width: 100px;
            height: 134px;
            border-radius: 8px;
            border: 4px solid rgba(255, 255, 255, 1)
        `; }

getHoverChatButtonStyles() { return `
            position: absolute;
            bottom: 8px;
            right: 50%;
            transform: translateX(50%);
            color: #fff;
            border-radius: 20px;
            padding: 6px 12px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            z-index: 10;
            transition: all 0.2s ease;
            user-select: none;
            border: none;
            outline: none;
            white-space: nowrap;
            background: linear-gradient(240deg, #A64FFE -15.52%, #0060FF 90.74%);
            font-family: PingFang SC, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            -webkit-tap-highlight-color: transparent;
        `; }

getHoverSpeechBubbleStyles() { let e = this.config.triggerConfig?.position || 'bottom-right'; let t = e === 'bottom-right' || e === 'top-right'; let i = this.isChinese ? '160px' : '210px'; return `
            position: absolute;
            ${t ? `left: -${i};` : `right: -${i};`};
            bottom: 40px;
            background: #fff;
            border-radius: ${t ? '14px 4px 14px 14px' : '4px 14px 14px 14px'};
            padding: 6px 10px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            z-index: 10;
            font-size: 12px;
            line-height: 18px;
            color: #333;
            display: block;
            text-align: center;
            font-family: PingFang SC, sans-serif;
            font-weight: 600;
        `; }} class g extends n {imageSrc; constructor(e, t, i) { super(e, t), this.imageSrc = i, this.styles = new u(e, t); }create(e) { this.config.triggerConfig && (this.onToggle = e, this.containerElement = document.createElement('div'), this.containerElement.className = 'embed-sdk-custom-enhanced-mobile-trigger', this.containerElement.style.cssText = this.getContainerStyles(), this.render(), document.body.appendChild(this.containerElement), this.initTypewriterEffect()); }destroy() { this.stopTypewriterEffect(), super.destroy(), this.speechBubbleElement = null; }render() { this.containerElement && (this.containerElement.innerHTML = '', this.renderEnhancedMobileView()); }unbind() { this.chatButtonElement && (this.chatButtonElement.removeEventListener('click', this.handleStartClick), this.chatButtonElement = null); }renderEnhancedMobileView() { if (!this.containerElement) return; let e = this.createEnhancedMobileViewHTML(); this.containerElement.innerHTML = e, this.chatButtonElement = this.containerElement.querySelector('.embed-sdk-custom-enhanced-mobile-chat-button'), this.chatButtonElement && this.chatButtonElement.addEventListener('click', this.handleStartClick), this.speechBubbleElement = this.containerElement.querySelector('.embed-sdk-custom-enhanced-mobile-speech-bubble'); }createEnhancedMobileViewHTML() { let e = this.generateChatButtonHTML('embed-sdk-custom-enhanced-mobile-chat-button', this.styles.getHoverChatButtonStyles()); let t = this.generateSpeechBubbleHTML({ className: 'embed-sdk-custom-enhanced-mobile-speech-bubble', style: this.styles.getHoverSpeechBubbleStyles(), emptyInitial: !0 }); return `
            <div class="embed-sdk-custom-enhanced-mobile-preview" style="${this.styles.getHoverPreviewStyles()}">
                <img
                    class="embed-sdk-custom-enhanced-mobile-image"
                    src="${this.imageSrc}"
                    alt="avatar"
                    style="${this.styles.getHoverMediaStyles()}"
                />
                ${e}
                ${t}
            </div>
        `; }

initTypewriterEffect() { setTimeout(() => { if (this.speechBubbleElement) { let e = this.getSpeechBubbleText(); this.startTypewriterEffect({ element: this.speechBubbleElement, text: e, onComplete: () => { setTimeout(() => { this.hideSpeechBubble(); }, 1e3); } }); } }, 300); }handleStartClick = () => { this.startConversation(); };} class b extends n {imageSrc; constructor(e, t, i) { super(e, t), this.imageSrc = i, this.styles = new u(e, t); }create(e) { this.config.triggerConfig && (this.onToggle = e, this.containerElement = document.createElement('div'), this.containerElement.className = 'embed-sdk-custom-normal-mobile-trigger', this.containerElement.style.cssText = this.getContainerStyles(), this.render(), document.body.appendChild(this.containerElement), this.initTypewriterEffect()); }destroy() { this.stopTypewriterEffect(), super.destroy(), this.speechBubbleElement = null; }render() { this.containerElement && (this.containerElement.innerHTML = '', this.renderNormalMobileView()); }unbind() { this.chatButtonElement && (this.chatButtonElement.removeEventListener('click', this.handleStartClick), this.chatButtonElement = null); }renderNormalMobileView() { if (!this.containerElement) return; let e = this.createNormalMobileViewHTML(); this.containerElement.innerHTML = e, this.chatButtonElement = this.containerElement.querySelector('.embed-sdk-custom-normal-mobile-chat-button'), this.chatButtonElement && this.chatButtonElement.addEventListener('click', this.handleStartClick), this.speechBubbleElement = this.containerElement.querySelector('.embed-sdk-custom-normal-mobile-speech-bubble'); }createNormalMobileViewHTML() { let e = this.generateChatButtonHTML('embed-sdk-custom-normal-mobile-chat-button', this.styles.getChatButtonStyles()); let t = this.generateSpeechBubbleHTML({ className: 'embed-sdk-custom-normal-mobile-speech-bubble', style: this.styles.getSpeechBubbleStyles(), emptyInitial: !0 }); return `
            <div class="embed-sdk-custom-normal-mobile-preview" style="${this.styles.getCompactPreviewStyles()}">
                <div class="embed-sdk-custom-normal-mobile-media-wrapper" style="${this.styles.getMediaWrapperStyles()}">
                    <div style="${this.styles.getMediaWrapperAfterStyles()}"></div>
                    <img
                        class="embed-sdk-custom-normal-mobile-image"
                        src="${this.imageSrc}"
                        alt="avatar"
                        style="${this.styles.getAvatarMediaStyles()}"
                    />
                </div>
                ${e}
                ${t}
            </div>
        `; }

initTypewriterEffect() { setTimeout(() => { if (this.speechBubbleElement) { let e = this.getSpeechBubbleText(); this.startTypewriterEffect({ element: this.speechBubbleElement, text: e, onComplete: () => { setTimeout(() => { this.hideSpeechBubble(); }, 1e3); } }); } }, 300); }handleStartClick = () => { this.startConversation(); };} class v {container = null; iframe = null; triggerView = null; config; detail = null; eventHandlers = null; originalMobileBodyStyle = null; originalPCBodyStyle = null; constructor(t, i) { this.config = t, this.detail = i, this.triggerView = (function (t, i) { if (e()) { if (i.figureVoiceVideo?.figureType === 0) { if (t.triggerConfig?.iconType === 'half') return new m(t, i, i.figureVoiceVideo?.cardPosterSrc); else return new p(t, i, i.figureVoiceVideo?.cardPosterSrc);
} else if (i.figureVoiceVideo?.figureType === 1) { if (t.triggerConfig?.iconType === 'half') return new g(t, i, i.figureVoiceVideo?.cardPosterSrc); else return new b(t, i, i.figureVoiceVideo?.cardPosterSrc);
} } let n = { silentVideoSrc: i.figureVoiceVideo?.templateVideoSrc || '', firstInteractionVideoSrc: i.figureVoiceVideo?.welcomeVideoSrc || '', hoverVideoSrc: i.figureVoiceVideo?.helpVideoSrc || '' }; if (i.figureVoiceVideo?.figureType === 0) { if (t.triggerConfig?.iconType === 'half') return new l(t, i, n); } else if (i.figureVoiceVideo?.figureType === 1) { if (t.triggerConfig?.iconType === 'half') return new d(t, i, n); else return new a(t, i, n);
} return new o(t, i, n); }(t, i)); }

updateDetail(e) { this.detail = e, this.triggerView?.updateDetail(e); }createContainer() { this.container = document.createElement('div'), this.container.className = 'embed-web-sdk-container'; let t = this.config.renderConfig?.zIndex || 9999; let i = this.config.renderConfig?.mode || 'floating'; let n = e(); i === 'fullscreen' || n
  ? this.container.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: calc(var(--vh, 1vh) * 100);
                z-index: ${t};
                visibility: hidden;
            `
  : i === 'modal'
    ? this.container.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: ${t};
                background-color: transparent;
                display: flex;
                justify-content: center;
                align-items: center;
                min-width: 900px;
                min-height: 506px;
                overflow: auto;
                visibility: hidden;
            `
    : this.container.style.cssText = `
                position: fixed;
                ${this.getPositionStyles()}
                z-index: ${t};
            `, document.body.appendChild(this.container); }

createIframe() { if (!this.container) return; this.iframe = document.createElement('iframe'), this.iframe.className = 'embed-web-sdk-iframe', this.iframe.allow = 'microphone; autoplay'; let t = this.config.renderConfig?.mode || 'floating'; let n = e(); if (t === 'fullscreen' || n) { this.iframe.style.cssText = `
                width: 100%;
                height: 100%;
                max-width: 100vw;
                border: none;
                background-color: white;
                display: none;
            `;
} else if (t === 'modal') { let e = i(this.detail?.employee.backgroundUrl, this.detail?.worker.dhBackground); this.iframe.style.cssText = `
                border: none;
                border-radius: 24px;
                background-image: url(${e});
                display: none;
            `, this.handleResize(); } else { let e = this.normalizeSize(this.config.renderConfig?.width || '375px'); let t = this.normalizeSize(this.config.renderConfig?.height || '666px'); this.iframe.style.cssText = `
                width: ${e};
                height: ${t};
                border: none;
                background-color: white;
                border-radius: 24px;
                display: none;
            `; } this.container.appendChild(this.iframe); }

createTrigger(e) { this.triggerView?.create(e); }show() { let e = this.config.renderConfig?.mode || 'floating'; this.container && (this.container.style.visibility = 'visible', e === 'modal' && (this.container.style.backgroundColor = 'rgba(0, 0, 0, 0.5)')), this.iframe && (this.attachIframe(), this.iframe.style.display = 'block', setTimeout(() => { this.iframe.classList.add('show'); }, 10)); }hide() { this.container && (this.container.style.visibility = 'hidden'), this.iframe && (this.iframe.classList.remove('show'), this.iframe.style.display = 'none'); }destroy() { this.container && (document.body.removeChild(this.container), this.container = null), this.triggerView?.destroy(), this.triggerView = null; let e = document.getElementById('embed-web-sdk-styles'); e && document.head.removeChild(e), this.iframe = null, this.unbindEvents(); }injectStyles() { let e = 'embed-web-sdk-styles'; if (document.getElementById(e)) return; let t = document.createElement('style'); t.id = e, t.textContent = `
            .embed-web-sdk-container {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }

            .embed-web-sdk-trigger:hover {
                transform: scale(1.1);
            }

            .embed-web-sdk-iframe {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.3s ease, transform 0.3s ease;
                background: #fff;
            }

            .embed-web-sdk-iframe.show {
                opacity: 1;
                transform: translateY(0);
            }
        `, document.head.appendChild(t); }

bindEvents(e) { this.eventHandlers = e, window.addEventListener('message', this.iframeMessageEventHandler), window.addEventListener('orientationchange', this.orientationChangeHandler), window.addEventListener('resize', this.windowResizeHandler); }unbindEvents() { window.removeEventListener('message', this.iframeMessageEventHandler), window.removeEventListener('orientationchange', this.orientationChangeHandler), window.removeEventListener('resize', this.windowResizeHandler), this.eventHandlers = null; }showTriggerElement() { this.triggerView?.show(); }handleResize() { if (!this.iframe || e() || (this.config.renderConfig?.mode || 'floating') !== 'modal') return; let i = window.innerWidth; let n = window.innerHeight - 120; let s = Math.min(i - 120, 1600); let r = s / t; r > n && (s = (r = n) * t), s < 900 && (r = (s = 900) / t), r < 506 && (s = (r = 506) * t), s = Math.floor(s), r = Math.floor(r), this.iframe.style.width = `${s}px`, this.iframe.style.height = `${r}px`; }lockScroll() { e() ? this.lockMobileBodyScroll() : this.lockPCBodyScroll(); }unlockScroll() { e() ? this.unlockMobileBodyScroll() : this.unlockPCBodyScroll(); }setRealViewportHeight() { let e = 0.01 * window.innerHeight; document.documentElement.style.setProperty('--vh', `${e}px`); }getPositionStyles() { let e = this.config.renderConfig?.position || 'bottom-right'; let t = this.config.renderConfig?.offset || { x: 24, y: 24 }; return ({ 'bottom-right': `bottom: ${t.y}px; right: ${t.x}px;`, 'bottom-left': `bottom: ${t.y}px; left: ${t.x}px;`, 'top-right': `top: ${t.y}px; right: ${t.x}px;`, 'top-left': `top: ${t.y}px; left: ${t.x}px;`, 'center': 'top: 50%; left: 50%; transform: translate(-50%, -50%);' })[e]; }normalizeSize(e) { return typeof e == 'number' ? `${e}px` : e; }attachIframe() { if (!this.iframe || !this.detail) return; let t = e(); let n = this.config.baseUrl; let s = this.config.renderConfig?.mode || 'floating'; let { employeeId: r } = this.config; let o = i(this.detail.employee.cardBackground, this.detail.worker.cardBackground); let l = this.detail.employee.position; let h = this.detail.employee.nickname; let a = `${n}/aiworker/embed/?employeeId=${r}&avatarUrl=${o}&nickname=${h}&position=${l}&autoStart=true&origin=${encodeURIComponent(window.location.origin)}`; t || (a += '&hideMobileHangupButton=true'), s === 'floating' && (a += '&forceMobileView=true'), this.iframe.src = a; }iframeMessageEventHandler = (e) => { this.eventHandlers && this.eventHandlers.onMessage(e); }; orientationChangeHandler = () => { this.eventHandlers && this.eventHandlers.onOrientationChange(); }; windowResizeHandler = () => { this.eventHandlers && this.eventHandlers.onResize(); }; lockMobileBodyScroll() { let e = document.body; this.originalMobileBodyStyle = { overflow: e.style.overflow || '', touchAction: e.style.touchAction || '', position: e.style.position || '', height: e.style.height || '' }, e.style.overflow = 'hidden', e.style.touchAction = 'none', e.style.position = 'fixed', e.style.height = '100%', e.style.width = '100%', e.style.top = '0', e.style.left = '0'; }unlockMobileBodyScroll() { let e = document.body; this.originalMobileBodyStyle && (e.style.overflow = this.originalMobileBodyStyle.overflow, e.style.touchAction = this.originalMobileBodyStyle.touchAction, e.style.position = this.originalMobileBodyStyle.position, e.style.height = this.originalMobileBodyStyle.height, e.style.width = '', e.style.top = '', e.style.left = '', this.originalMobileBodyStyle = null); }lockPCBodyScroll() { let e = document.body; this.originalPCBodyStyle = { overflow: e.style.overflow || '', overscrollBehavior: e.style.overscrollBehavior || '', position: e.style.position || '' }, e.style.overflow = 'hidden', e.style.overscrollBehavior = 'contain', e.style.position = 'relative'; }unlockPCBodyScroll() { let e = document.body; this.originalPCBodyStyle && (e.style.overflow = this.originalPCBodyStyle.overflow, e.style.overscrollBehavior = this.originalPCBodyStyle.overscrollBehavior, e.style.position = this.originalPCBodyStyle.position, this.originalPCBodyStyle = null); }} typeof window != 'undefined' && (window.EmbedKyEmployeeSDK = class {config; view = null; detail = null; isIframeVisible = !1; constructor(e) { this.config = { baseUrl: 'https://ky.cloud.baidu.com', autoShow: !0, renderConfig: { width: '400px', height: '600px', position: 'bottom-right', mode: 'floating', zIndex: 9999, offset: { x: 20, y: 20 } }, ...e }, this.init(); }show = () => { this.view?.show(), this.view?.lockScroll(), this.isIframeVisible = !0; }; hide = () => { this.view?.hide(), this.view?.unlockScroll(), this.isIframeVisible = !1; }; toggle = () => { this.isIframeVisible ? this.hide() : this.show(); }; destroy = () => { this.view?.unlockScroll(), this.view?.destroy(); }; isVisible() { return this.isIframeVisible; } async init() { await this.fetchDetail(this.config.employeeId), this.view = new v(this.config, this.detail), this.view.setRealViewportHeight(), this.view.updateDetail(this.detail), this.view.createContainer(), this.view.createIframe(), this.config.triggerConfig?.enabled && this.view.createTrigger(() => this.toggle()), this.view.injectStyles(), this.view.bindEvents({ onMessage: this.handleMessage, onOrientationChange: this.handleOrientationChange, onResize: this.handleResize }), this.config.triggerConfig?.enabled || this.show(); } async fetchDetail(e) { return fetch(`https://ky.cloud.baidu.com/employee-console/v1/employees/r/detail?id=${e}`, { method: 'GET' }).then(e => e.json()).then((e) => { this.detail = e.data; }).catch((e) => { console.error(e); }); }handleMessage = (e) => { let t = e.data; t.source === 'ky-employee-embed-widget' && t.type === 'close' && (this.hide(), this.view?.showTriggerElement()); }; handleOrientationChange = () => { this.view?.setRealViewportHeight(); }; handleResize = () => { this.view?.setRealViewportHeight(), this.view?.handleResize(); };}); })();
