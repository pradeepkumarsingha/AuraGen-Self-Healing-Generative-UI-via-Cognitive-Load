// backend/src/services/cognitiveEventService.js
import { generateAdaptiveUiSpec } from '../ai/uiGenerator.js';

export async function handleCognitiveLoadHigh(io, socket, data) {
  const section = data.section || 'studentInfo';
  const field = data.field || null;
  console.log(`[Backend CognitiveEventService] Received COGNITIVE_LOAD_HIGH for section: "${section}", field: "${field}", Score: ${data.score}%`);
// backend/src/services/cognitiveEventService.js
  try {
    const uiSpec = await generateAdaptiveUiSpec({
      score: data.score,
      section: section,
      field: field,
      formState: data.formState || {}
    });

    socket.emit('AURAGEN_TRIGGERED', {
      message: 'AuraGen detected high interaction friction. Generative UI activated.',
      section: section,
      uiSpec
    });
    console.log(`[Backend CognitiveEventService] Dispatched AURAGEN_TRIGGERED (section: "${uiSpec.targetSection || section}") to client: ${socket.id}`);
  } catch (error) {
    console.error(`[Backend CognitiveEventService] Failed to generate adaptive UI spec for section "${section}":`, error);
    socket.emit('AURAGEN_TRIGGERED', {
      message: 'AuraGen detected high interaction friction.',
      section: section,
      error: error.message
    });
  }
}
