import { booleanAttribute, Component, input } from '@angular/core'

@Component({
  selector: 'app-loading-spinner',
  imports: [],
  templateUrl: './loading-spinner.html',
  styleUrl: './loading-spinner.scss',
  host: {
    '[class.cover]': 'cover()'
  }
})
export class LoadingSpinner {
  label = input<string>()
  cover = input(false, { transform: booleanAttribute })
}
