// src/app/animations/animations.ts
import { trigger, transition, style, animate } from '@angular/animations';

// Vertical Slide Up/Down Animation
export const slideUpDownAnimation = trigger('slideUpDownAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(100px)' }),
    animate('{{duration}} {{delay}} ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ])
]);


// Horizontal Slide Left/Right Animation
export const slideLeftRightAnimation = trigger('slideLeftRightAnimation', [
  transition(':leave', [
    style({ transform: 'translateX(-100%)', opacity: 0 }),
    animate('500ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
  ]),
  transition(':enter', [
    animate('700ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
  ])
]);


