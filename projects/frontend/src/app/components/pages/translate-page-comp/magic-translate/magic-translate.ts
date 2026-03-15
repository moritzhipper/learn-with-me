import { Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { IconComp } from '../../../shared/icon-comp/icon-comp'

@Component({
  selector: 'app-magic-translate',
  imports: [FormsModule, IconComp],
  templateUrl: './magic-translate.html',
  styleUrl: './magic-translate.scss'
})
export class MagicTranslate {
  text = signal<string>('')
}
