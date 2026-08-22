import { booleanAttribute, Component, input } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { remixUserFollowLine, remixUserVoiceLine } from '@ng-icons/remixicon'
import { LanguageConfig } from '@shared/types'

@Component({
  selector: 'liz-language-match',
  imports: [NgIcon],
  providers: [provideIcons({ remixUserFollowLine, remixUserVoiceLine })],
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
  languageConfig = input.required<LanguageConfig>()
  big = input(false, { transform: booleanAttribute })
}
