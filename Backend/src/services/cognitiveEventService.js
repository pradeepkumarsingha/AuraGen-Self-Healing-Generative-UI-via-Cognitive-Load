// Backend/src/services/cognitiveEventService.js
import { generateAdaptiveUiSpec } from '../ai/uiGenerator.js';

export async function handleCognitiveLoadHigh(io, socket, data) {
  const section = data.section || 'studentInfo';
  const field = data.field || null;
  console.log(`[Backend CognitiveEventService] Received COGNITIVE_LOAD_HIGH for section: "${section}", field: "${field}", Score: ${data.score}%`);

  // Emit immediate generation status for UI latency feedback
  socket.emit('AURAGEN_STATUS', {
    status: 'generating',
    section: section
  });

  try {
    const result = await generateAdaptiveUiSpec({
      score: data.score,
      section: section,
      field: field,
      formState: data.formState || {}
    });

    const spec = result.spec || result;
    const isCached = !!result.cached;
    const statusType = isCached ? 'cached' : (result.isFallback || !spec.isLiveAi ? 'fallback' : 'complete');

    socket.emit('AURAGEN_TRIGGERED', {
      message: 'AuraGen detected high interaction friction. Generative UI activated.',
      section: section,
      uiSpec: spec,
      spec: spec,
      cached: isCached,
      status: statusType
    });
    console.log(`[Backend CognitiveEventService] Dispatched AURAGEN_TRIGGERED (section: "${spec.targetSection || section}", status: "${statusType}", cached: ${isCached}) to client: ${socket.id}`);
  } catch (error) {
    console.error(`[Backend CognitiveEventService] Failed to generate adaptive UI spec for section "${section}":`, error);
    socket.emit('AURAGEN_TRIGGERED', {
      message: 'AuraGen detected high interaction friction.',
      section: section,
      status: 'error',
      error: error.message
    });
  }
}
