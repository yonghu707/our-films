/**
 * 情侣电影网站 — 批量压缩脚本
 * 用法: node compress-all.js
 */
const { execSync } = require('child_process');
const { readdirSync, statSync, mkdirSync, existsSync, renameSync, unlinkSync } = require('fs');
const { join, extname } = require('path');

// 使用剪映自带的 ffmpeg
const FFMPEG = 'C:/Users/马文泽熙/AppData/Local/JianyingPro/Apps/10.5.0.13988/ffmpeg.exe';

const ROOT = __dirname;
const AUDIO_DIR = join(ROOT, 'audio');
const BACKUP_DIR = join(AUDIO_DIR, '_backup');
const POSTER_DIR = join(ROOT, 'posters');

// ===================== 音频：MP4 → MP3 (128kbps) =====================
async function compressAudio() {
  console.log('\n🎵 === 音频压缩 (提取为 MP3 128kbps) ===\n');

  if (!existsSync(BACKUP_DIR)) mkdirSync(BACKUP_DIR);

  const files = readdirSync(AUDIO_DIR).filter(f =>
    ['.mp4', '.m4a', '.aac', '.ogg', '.wav'].includes(extname(f).toLowerCase())
  );

  for (const file of files) {
    const src = join(AUDIO_DIR, file);
    const sizeMB = (statSync(src).size / 1024 / 1024).toFixed(1);

    // 跳过 < 2MB 的文件
    if (statSync(src).size < 2 * 1024 * 1024) {
      console.log(`⏭️  ${file} (${sizeMB} MB) — 已很小，跳过`);
      continue;
    }

    const mp3Name = file.replace(/\.(mp4|m4a|aac|ogg|wav)$/i, '.mp3');
    const tmp = join(AUDIO_DIR, '_tmp_' + mp3Name);
    const dst = join(AUDIO_DIR, mp3Name);
    const bak = join(BACKUP_DIR, file);

    process.stdout.write(`🔄 ${file} (${sizeMB} MB) → ${mp3Name} ...`);

    try {
      // 提取音频，用 Windows 原生 MP3 编码器 128kbps
      execSync(
        `"${FFMPEG}" -y -i "${src}" -vn -c:a mp3_mf -b:a 128k "${tmp}"`,
        { stdio: 'pipe', timeout: 300000, windowsHide: true }
      );

      const newSizeMB = (statSync(tmp).size / 1024 / 1024).toFixed(1);
      const reduction = ((1 - statSync(tmp).size / statSync(src).size) * 100).toFixed(0);

      // 备份原文件 → 移动压缩后的文件
      renameSync(src, bak);
      renameSync(tmp, dst);

      console.log(` ✅ ${newSizeMB} MB (减小 ${reduction}%)`);
    } catch (e) {
      console.log(` ❌ 失败: ${e.stderr ? e.stderr.toString().slice(0, 80) : e.message}`);
      try { unlinkSync(tmp); } catch (_) {}
    }
  }
}

// ===================== 图片压缩 =====================
async function compressPosters() {
  console.log('\n🖼️  === 海报图片压缩 ===\n');

  const files = readdirSync(POSTER_DIR).filter(f =>
    ['.jpg', '.jpeg', '.png'].includes(extname(f).toLowerCase())
  );

  for (const file of files) {
    const src = join(POSTER_DIR, file);
    const tmp = join(POSTER_DIR, '_opt_' + file);
    const sizeKB = (statSync(src).size / 1024).toFixed(0);

    if (statSync(src).size < 300 * 1024) {
      console.log(`⏭️  ${file} (${sizeKB} KB) — 已够小，跳过`);
      continue;
    }

    process.stdout.write(`🔄 ${file} (${sizeKB} KB) → 压缩中...`);

    try {
      // 缩放至宽度 800px + JPEG 质量压缩
      execSync(
        `"${FFMPEG}" -y -i "${src}" -vf "scale=800:-1" -q:v 5 "${tmp}"`,
        { stdio: 'pipe', timeout: 60000, windowsHide: true }
      );

      const newSizeKB = (statSync(tmp).size / 1024).toFixed(0);
      const reduction = ((1 - statSync(tmp).size / statSync(src).size) * 100).toFixed(0);

      renameSync(tmp, src);

      console.log(` ✅ ${newSizeKB} KB (减小 ${reduction}%)`);
    } catch (e) {
      console.log(` ❌ 失败: ${e.stderr ? e.stderr.toString().slice(0, 80) : e.message}`);
      try { unlinkSync(tmp); } catch (_) {}
    }
  }
}

// ===================== 主流程 =====================
(async () => {
  console.log('🚀 情侣电影网站资源批量压缩\n');
  console.log(`ffmpeg: ${FFMPEG}\n`);

  await compressAudio();
  await compressPosters();

  console.log('\n✨ 全部完成！');
  console.log(`   音频备份: ${BACKUP_DIR}`);
  console.log('   下一步: 需要更新 index.html 中的音频路径 (.mp4 → .mp3)\n');
})();
