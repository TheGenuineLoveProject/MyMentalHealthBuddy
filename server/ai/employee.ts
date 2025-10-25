import { echo } from './tools/echo.js';
import { journalingSaver } from './tools/journaling_saver.js';
import { contentDrafter } from './tools/content_drafter.js';

type ToolName = 'echo'|'journaling_saver'|'content_drafter';

export class HealerBot {
  name = 'healer_bot';
  tools: Record<ToolName, (arg: string)=>Promise<unknown>> = {
    echo,
    journaling_saver: journalingSaver,
    content_drafter: contentDrafter
  };

  async respond(input: string) {
    if (/journal|write|diary/i.test(input)) {
      const meta = await this.tools.journaling_saver(input);
      return { reply: 'I saved a gentle journal note for you. 💛', used: ['journaling_saver'], meta };
    }
    if (/idea|post|script|content/i.test(input)) {
      const draft = await this.tools.content_drafter(input);
      return { reply: String(draft), used: ['content_drafter'], meta: {} };
    }
    const e = await this.tools.echo(input);
    return { reply: String(e), used: ['echo'], meta: {} };
  }
}
