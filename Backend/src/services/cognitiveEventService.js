// backend/src/services/cognitiveEventService.js
import { generateAdaptiveUiSpec } from '../ai/uiGenerator.js';

export async function handleCognitiveLoadHigh(io, socket, data) {
  console.log('[CognitiveEventService] Processing COGNITIVE_LOAD_HIGH event:', data);

  try {
    const uiSpec = await generateAdaptiveUiSpec({
      score: data.score,
      section: data.section || 'existingLoansAndCredit',
      formState: data.formState || {}
    });

    socket.emit('AURAGEN_TRIGGERED', {
      message: 'AuraGen detected high interaction friction. Generative UI activated.',
      section: data.section,
      uiSpec
    });
    console.log('[CognitiveEventService] Dispatched AURAGEN_TRIGGERED with UI Spec to client:', socket.id);
  } catch (error) {
    console.error('[CognitiveEventService] Failed to generate adaptive UI spec:', error);
    socket.emit('AURAGEN_TRIGGERED', {
      message: 'AuraGen detected high interaction friction.',
      section: data.section,
      error: error.message
    });
  }
}