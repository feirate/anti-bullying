 # 宫崎骏风格食堂场景提示词模板

## 主要提示词 (Positive Prompt)

```
Studio Ghibli style, Hayao Miyazaki art style, warm color palette, soft lighting, detailed illustration, high quality, masterpiece, best quality, ultra detailed, cinematic lighting, from user's perspective, first person view, school cafeteria interior, natural lighting from large windows, wooden tables and chairs, {time_of_day} atmosphere, 

{main_character_name} sitting alone at a table, {main_character_description}, wearing {main_character_clothing}, eating {main_character_food}, looking down with a sad expression, isolated and lonely, 

group of students nearby, {group_size} students, {group_description}, pointing and laughing at {main_character_name}, making loud comments about his clothes and lunch, mocking expressions, 

emotional atmosphere of bullying and isolation, subtle sadness, Studio Ghibli emotional storytelling, soft shadows, gentle color grading, detailed facial expressions, character consistency, 

{additional_scene_details}
```

## 负面提示词 (Negative Prompt)

```
low quality, blurry, distorted, deformed, bad anatomy, disfigured, poorly drawn face, mutated, extra limb, ugly, poorly drawn hands, missing limb, floating limbs, disconnected limbs, malformed hands, blur, out of focus, long neck, long body, mutated hands and fingers, out of frame, blender, doll, cropped, low-res, close-up, poorly-drawn face, out of frame double, two heads, blurred, ugly, disfigured, too many fingers, deformed, repetitive, black and white, grainy, extra limbs, bad anatomy, high pass filter, airbrush, portrait, zoomed, soft light, smooth skin, closeup, deformed, extra limbs, extra fingers, deformed hands, bad anatomy, bad proportions, blind, bad eyes, ugly eyes, dead eyes, blur, vignette, out of shot, out of focus, gaussian, closeup, monochrome, grainy, noisy, text, watermark, logo, oversaturation, over saturation, over shadow
```

## 人物描述模板

### 主角 (小明) 特征描述
```
main_character_name: "Xiao Ming"
main_character_description: "Asian boy, 15 years old, medium height, slightly thin build, gentle features, round glasses, neat short black hair, kind but shy expression"
main_character_clothing: "simple white shirt, dark blue school uniform pants, clean but slightly worn clothes"
main_character_food: "simple packed lunch in a brown paper bag, modest meal"
```

### 其他学生群体描述
```
group_size: "4-6"
group_description: "mixed group of students, various heights and builds, wearing school uniforms, some with trendy accessories, confident and popular-looking"
```

## 场景细节变量

### 时间氛围
- `time_of_day`: "morning sunlight", "afternoon golden hour", "lunchtime bright", "dusk warm lighting"

### 额外场景细节
- `additional_scene_details`: "steam rising from food trays, scattered books and bags, school announcements on PA system, distant chatter, clinking of utensils"

## 技术参数设置

### 基础参数
- **Steps**: 30-40
- **CFG Scale**: 7-8
- **Sampler**: DPM++ 2M Karras
- **Size**: 1024x1024 或 1024x768 (横向)
- **Model**: 支持宫崎骏风格的模型 (如: Anything V3, Counterfeit V3)

### 一致性保持技巧
1. **Seed固定**: 使用相同的seed值保持风格一致性
2. **人物特征**: 详细描述人物特征，包括发型、眼镜、服装等
3. **风格权重**: 在提示词中重复"Studio Ghibli style"确保风格一致
4. **表情描述**: 详细描述人物表情和情绪状态

## 使用示例

### 完整提示词示例
```
Studio Ghibli style, Hayao Miyazaki art style, warm color palette, soft lighting, detailed illustration, high quality, masterpiece, best quality, ultra detailed, cinematic lighting, from user's perspective, first person view, school cafeteria interior, natural lighting from large windows, wooden tables and chairs, afternoon golden hour atmosphere, 

Xiao Ming sitting alone at a table, Asian boy, 15 years old, medium height, slightly thin build, gentle features, round glasses, neat short black hair, kind but shy expression, wearing simple white shirt, dark blue school uniform pants, clean but slightly worn clothes, eating simple packed lunch in a brown paper bag, modest meal, looking down with a sad expression, isolated and lonely, 

group of students nearby, 5 students, mixed group of students, various heights and builds, wearing school uniforms, some with trendy accessories, confident and popular-looking, pointing and laughing at Xiao Ming, making loud comments about his clothes and lunch, mocking expressions, 

emotional atmosphere of bullying and isolation, subtle sadness, Studio Ghibli emotional storytelling, soft shadows, gentle color grading, detailed facial expressions, character consistency, 

steam rising from food trays, scattered books and bags, school announcements on PA system, distant chatter, clinking of utensils
```

## 提示词优化建议

1. **保持一致性**: 每次生成时使用相同的人物描述
2. **情感表达**: 重点描述人物的情感状态和表情
3. **光影效果**: 强调宫崎骏特有的温暖光影
4. **细节丰富**: 添加环境细节增强真实感
5. **视角控制**: 确保从用户视角观看场景

## 注意事项

- 避免过于复杂的场景描述，保持画面简洁
- 确保人物特征描述详细且一致
- 适当调整CFG Scale来控制生成质量
- 使用相同的seed值可以保持风格一致性
- 根据具体需求调整场景细节和时间氛围