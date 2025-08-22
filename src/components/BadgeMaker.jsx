import React, { useState, useRef } from 'react'
import html2canvas from 'html2canvas'
import './BadgeMaker.css'

const BadgeMaker = () => {
  const [iconImage, setIconImage] = useState(null)
  const [backgroundColor, setBackgroundColor] = useState('#4CAF50')
  const [text, setText] = useState('徽章文字')
  const [textColor, setTextColor] = useState('#FFFFFF')
  const [selectedPreset, setSelectedPreset] = useState('custom')
  const [useGradient, setUseGradient] = useState(false)
  const [gradientType, setGradientType] = useState('linear')
  const [gradientDirection, setGradientDirection] = useState('to right')
  const [gradientColor1, setGradientColor1] = useState('#4CAF50')
  const [gradientColor2, setGradientColor2] = useState('#45a049')
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

  // 预设渐变样式
  const gradientPresets = [
    { id: 'sunset', name: '日落', color1: '#FF6B6B', color2: '#FFE66D', direction: 'to right' },
    { id: 'ocean', name: '海洋', color1: '#667eea', color2: '#764ba2', direction: 'to right' },
    { id: 'forest', name: '森林', color1: '#11998e', color2: '#38ef7d', direction: 'to right' },
    { id: 'fire', name: '火焰', color1: '#ff9a9e', color2: '#fecfef', direction: 'to right' },
    { id: 'sky', name: '天空', color1: '#a8edea', color2: '#fed6e3', direction: 'to right' },
    { id: 'sunrise', name: '日出', color1: '#ffecd2', color2: '#fcb69f', direction: 'to right' }
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
      setUseGradient(false)
      if (presetId !== 'custom') {
        setText(preset.name)
      }
    }
  }

  const handleGradientPresetChange = (preset) => {
    setGradientColor1(preset.color1)
    setGradientColor2(preset.color2)
    setGradientDirection(preset.direction)
    setUseGradient(true)
    setSelectedPreset('custom')
  }

  const getBackgroundStyle = () => {
    if (useGradient) {
      if (gradientType === 'linear') {
        return {
          background: `linear-gradient(${gradientDirection}, ${gradientColor1}, ${gradientColor2})`
        }
      } else {
        return {
          background: `radial-gradient(circle, ${gradientColor1}, ${gradientColor2})`
        }
      }
    } else {
      return {
        backgroundColor: backgroundColor
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
        // 应用背景样式
        Object.assign(clone.style, getBackgroundStyle())
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
          <label>渐变预设:</label>
          <div className="preset-grid">
            {gradientPresets.map((preset) => (
              <button
                key={preset.id}
                className="preset-btn gradient-preset"
                style={{ 
                  background: `linear-gradient(${preset.direction}, ${preset.color1}, ${preset.color2})`,
                  color: '#FFFFFF'
                }}
                onClick={() => handleGradientPresetChange(preset)}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        <div className="control-group">
          <label>背景类型:</label>
          <div className="background-type-controls">
            <label className="radio-label">
              <input
                type="radio"
                name="backgroundType"
                checked={!useGradient}
                onChange={() => setUseGradient(false)}
              />
              纯色
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="backgroundType"
                checked={useGradient}
                onChange={() => setUseGradient(true)}
              />
              渐变
            </label>
          </div>
        </div>

        {!useGradient ? (
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
        ) : (
          <>
            <div className="control-group">
              <label>渐变类型:</label>
              <select
                value={gradientType}
                onChange={(e) => setGradientType(e.target.value)}
                className="select-input"
              >
                <option value="linear">线性渐变</option>
                <option value="radial">径向渐变</option>
              </select>
            </div>

            {gradientType === 'linear' && (
              <div className="control-group">
                <label>渐变方向:</label>
                <select
                  value={gradientDirection}
                  onChange={(e) => setGradientDirection(e.target.value)}
                  className="select-input"
                >
                  <option value="to right">从左到右</option>
                  <option value="to left">从右到左</option>
                  <option value="to bottom">从上到下</option>
                  <option value="to top">从下到上</option>
                  <option value="45deg">对角线</option>
                  <option value="-45deg">反向对角线</option>
                </select>
              </div>
            )}

            <div className="control-group">
              <label>渐变颜色:</label>
              <div className="gradient-colors">
                <div className="color-input-group">
                  <label>颜色1:</label>
                  <input
                    type="color"
                    value={gradientColor1}
                    onChange={(e) => setGradientColor1(e.target.value)}
                    className="color-input"
                  />
                </div>
                <div className="color-input-group">
                  <label>颜色2:</label>
                  <input
                    type="color"
                    value={gradientColor2}
                    onChange={(e) => setGradientColor2(e.target.value)}
                    className="color-input"
                  />
                </div>
              </div>
            </div>
          </>
        )}

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
      </div>

      <div className="preview">
        <button onClick={exportBadge} className="export-btn">
          导出徽章 (PNG)
        </button>
        
        <h3>预览</h3>
        <div className="badge-container">
          <div
            ref={badgeRef}
            className="badge"
            style={{
              ...getBackgroundStyle(),
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