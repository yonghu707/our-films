/**
 * 从 MP4 视频中提取纯音频流（去掉视频轨道）
 * 用法: node extract-audio.js
 *
 * 这些 .mp4 文件实际是带视频的视频文件，
 * 音频流只有 48kbps AAC，视频流占了大头。
 * 直接提取音频流，速度极快，无损音质。
 */
const { execSync } = require('child_process');
const { readdirSync, statSync, mkdirSync, existsSync, renameSync, unlinkSync } = require('fs');
const { join, extname } = require('path');

const FFMPEG = 'C:/Users/马文泽熙/AppData/Local/JianyingPro/Apps/10.5.0.13988/ffmpeg.exe';

const AUDIO_DIR = join(__dirname, 'audio');
const BACKUP_DIR = join(AUDIO_DIR, '_backup_video');

async function main() {
  console.log('🎵 从视频文件中提取纯音频流\n');

  if (!existsSync(BACKUP_DIR)) mkdirSync(BACKUP_DIR, { recursive: true });

  const files = readdirSync(AUDIO_DIR).filter(f =>
    ['.mp4'].includes(extname(f).toLowerCase())
  );

  let totalBefore = 0, totalAfter = 0;

  for (const file of files) {
    const src = join(AUDIO_DIR, file);
    const tmp = join(AUDIO_DIR, '_extract_' + file);
    const sizeBefore = statSync(src).size;
    totalBefore += sizeBefore;
    const sizeMB = (sizeBefore / 1024 / 1024).toFixed(1);

    process.stdout.write(`🔄 ${file} (${sizeMB} MB) → 提取音频...`);

    try {
      // -vn = 不要视频, -c:a copy = 音频直接复制（不重新编码）
      execSync(
        `"${FFMPEG}" -y -i "${src}" -vn -c:a copy "${tmp}"`,
        { stdio: 'pipe', timeout: 60000, windowsHide: true }
      );

      const sizeAfter = statSync(tmp).size;
      totalAfter += sizeAfter;
      const newSizeMB = (sizeAfter / 1024 / 1024).toFixed(2);
      const reduction = ((1 - sizeAfter / sizeBefore) * 100).toFixed(0);

      // 备份原视频文件 → 纯音频替换
      renameSync(src, join(BACKUP_DIR, file));
      renameSync(tmp, src);

      console.log(` ✅ ${newSizeMB} MB (减小 ${reduction}%)`);
    } catch (e) {
      console.log(` ❌ 失败`);
      try { unlinkSync(tmp); } catch (_) {}
    }
  }

  console.log('\n📊 汇总:');
  console.log(`   压缩前: ${(totalBefore/1024/1024).toFixed(1)} MB`);
  console.log(`   压缩后: ${(totalAfter/1024/1024).toFixed(1)} MB`);
  console.log(`   节省:   ${((totalBefore-totalAfter)/1024/1024).toFixed(1)} MB (${((1-totalAfter/totalBefore)*100).toFixed(0)}%)`);
  console.log(`   视频备份: ${BACKUP_DIR}`);
  console.log('\n✨ 完成！不需要修改 HTML 代码，文件路径不变。\n');
}

main();
