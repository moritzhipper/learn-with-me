import { booleanAttribute, Component, input } from '@angular/core'
import { NgIcon } from '@ng-icons/core'
import { LanguageConfig } from '@shared/types'
import { learnLanguageIcon, speakLanguageIcon } from '../../../icon-registry'

@Component({
  selector: 'liz-language-match',
  imports: [NgIcon],
  templateUrl: './language-match.html',
  styles: `
    p {
      .icons {
        display: inline-flex;
        align-items: center;
        translate: -1px 3px;
        padding: 0 var(--distance-0);
        gap: var(--distance-0);
        margin: -6px 0;

        ng-icon {
          width: 1em;
          height: 1em;
        }

        .dash {
          font-size: var(--font-size-0);
          opacity: var(--opacity-0);
        }
      }
    }
  `
})
export class LanguageMatch {
  protected readonly icons = {
    learnLanguageIcon,
    speakLanguageIcon
  }
  languageConfig = input.required<LanguageConfig>()
  big = input(false, { transform: booleanAttribute })
}
