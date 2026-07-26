import { Component, input } from '@angular/core'
import { LanguageConfig } from '@shared/types'
import { IconComp } from '../icon-comp/icon-comp'

@Component({
  selector: 'liz-language-match',
  imports: [IconComp],
  templateUrl: './language-match.html',
  styleUrl: './language-match.scss',
  styles: `
    p {
      .icons {
        display: inline-flex;
        align-items: center;
        translate: -1px 3px;
        padding: 0 var(--distance-0);
        gap: var(--distance-0);

        app-icon-comp {
          margin: -8px 0;
          width: var(--font-size-1);
          height: var(--line-height-0);
        }

        .dash {
          font-size: var(--font-size-0);
          opacity: var(--opacity-1);
        }
      }
    }
  `
})
export class LanguageMatch {
  languageConfig = input.required<LanguageConfig>()
}
