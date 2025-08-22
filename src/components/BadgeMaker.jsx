import React, { useState, useRef } from 'react'
import html2canvas from 'html2canvas'
import './BadgeMaker.css'

const BadgeMaker = () => {
  const [iconImage, setIconImage] = useState(null)
  const [backgroundColor, setBackgroundColor] = useState('#4CAF50')
  const [text, setText] = useState('徽章文字')
  const [textColor, setTextColor] = useState('#FFFFFF')
  const [selectedPreset, setSelectedPreset] = useState('custom')
  const badgeRef = useRef(null)

  // 预设徽章样式
  const presets = [
    { id: 'custom', name: '自定义', bg: '#4CAF50', text: '#FFFFFF' },
    { id: 'admin', name: '管理员', bg: '#2E7D32', text: '#FFFFFF' },
    { id: 'dev', name: '开发者', bg: '#6A1B9A', text: '#FFFFFF' },
    { id: 'fan', name: '粉丝', bg: '#E91E63', text: '#FFFFFF' },
    { id: 'vip', name: 'VIP', bg: '#FF9800', text: '#FFFFFF' },
    { id: 'new', name: '新手', bg: '#2196F3', text: '#FFFFFF' },
    { id: 'offline', name: '离线', bg: '#757575', text: '#FFFFFF' },
    { id: 'online', name: '在线', bg: '#4CAF50', text: '#FFFFFF' }
  ]

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setIconImage(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePresetChange = (presetId) => {
    const preset = presets.find(p => p.id === presetId)
    if (preset) {
      setSelectedPreset(presetId)
      setBackgroundColor(preset.bg)
      setTextColor(preset.text)
      if (presetId !== 'custom') {
        setText(preset.name)
      }
    }
  }

  const exportBadge = async () => {
    if (badgeRef.current) {
      try {
        // 创建一个临时的克隆元素，保持徽章本身的背景颜色
        const clone = badgeRef.current.cloneNode(true)
        clone.style.position = 'absolute'
        clone.style.left = '-9999px'
        clone.style.top = '-9999px'
        // 不设置backgroundColor为transparent，保持徽章本身的背景色
        document.body.appendChild(clone)

        const canvas = await html2canvas(clone, {
          backgroundColor: null, // 设置为null，让徽章外部的区域透明
          scale: 2, // 提高导出质量
          useCORS: true,
          allowTaint: true,
          logging: false,
          width: clone.offsetWidth,
          height: clone.offsetHeight
        })
        
        // 移除临时元素
        document.body.removeChild(clone)
        
        // 创建下载链接 - 使用PNG格式以保持透明度
        const link = document.createElement('a')
        link.download = `badge-${text}.png`
        
        // 将canvas转换为PNG格式的blob
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            link.href = url
            link.click()
            // 清理URL对象
            URL.revokeObjectURL(url)
          }
        }, 'image/png')
        
      } catch (error) {
        console.error('导出失败:', error)
        alert('导出失败，请重试')
      }
    }
  }

  return (
    <div className="badge-maker">
      <div className="controls">
        <div className="control-group">
          <label>预设样式:</label>
          <div className="preset-grid">
            {presets.map((preset) => (
              <button
                key={preset.id}
                className={`preset-btn ${selectedPreset === preset.id ? 'active' : ''}`}
                style={{ backgroundColor: preset.bg }}
                onClick={() => handlePresetChange(preset.id)}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        <div className="control-group">
          <label>上传图标:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="file-input"
          />
        </div>

        <div className="control-group">
          <label>背景颜色:</label>
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => {
              setBackgroundColor(e.target.value)
              setSelectedPreset('custom')
            }}
            className="color-input"
          />
        </div>

        <div className="control-group">
          <label>文字内容:</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="text-input"
            placeholder="输入徽章文字"
          />
        </div>

        <div className="control-group">
          <label>文字颜色:</label>
          <input
            type="color"
            value={textColor}
            onChange={(e) => {
              setTextColor(e.target.value)
              setSelectedPreset('custom')
            }}
            className="color-input"
          />
        </div>

        <button onClick={exportBadge} className="export-btn">
          导出徽章 (PNG)
        </button>
      </div>

      <div className="preview">
        <h3>预览</h3>
        <div className="badge-container">
          <div
            ref={badgeRef}
            className="badge"
            style={{
              backgroundColor: backgroundColor,
              color: textColor
            }}
          >
            {iconImage && (
              <div 
                className="badge-icon-container"
                style={{
                  backgroundImage: `url(${iconImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
              </div>
            )}
            <span className="badge-text">{text}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BadgeMaker 