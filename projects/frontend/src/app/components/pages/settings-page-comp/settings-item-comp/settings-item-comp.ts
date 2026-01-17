import { Component, input } from '@angular/core'

@Component({
  selector: 'app-settings-item-comp',
  imports: [],
  templateUrl: './settings-item-comp.html',
  styleUrl: './settings-item-comp.scss'
})
export class SettingsItemComp {
  header = input.required<string>()
}
