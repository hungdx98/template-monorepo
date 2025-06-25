import { extendTailwindMerge } from 'tailwind-merge';
import clsx, { ClassValue } from 'clsx';

const twMerge1 = extendTailwindMerge({
  extend: {
    classGroups: {
      'text-color': [
        {
          text: [
            (value: string) => {
              const keys = ['button', 'text', 'icon', 'wallet', 'field', 'overlay', 'link', 'border', 'background'];
              const isMatched = keys.some((it) => value.includes(it));
              return isMatched;
            },
          ],
        },
      ],
      'bg-color': [
        {
          bg: [
            (value: string) => {
              const keys = ['button', 'text', 'icon', 'wallet', 'field', 'overlay', 'link', 'border', 'background'];
              const isMatched = keys.some((it) => value.includes(it));
              return isMatched;
            },
          ],
        },
      ],
      'rounded': [
        {
          rounded: [
            (value: string) => {
              const keys = ['radius', 'round'];
              const isMatched = keys.some((it) => value.includes(it));
              return isMatched;
            },
          ],
        },
      ],
      'font-size': [
        {
          text: [
            (value: string) => {
              const keys = ['font-size'];
              const isMatched = keys.some((it) => value.includes(it));
              return isMatched;
            },
          ],
        },
      ],
      w: [
        {
          w: [
            (value: string) => {
              const keys = ['size', 'space'];
              const isMatched = keys.some((it) => value.includes(it));
              return isMatched;
            },
          ],
        },
      ],
      p: [
        {
          p: [
            (value: string) => {
              const keys = ['space', 'size'];
              const isMatched = keys.some((it) => value.includes(it));
              return isMatched;
            },
          ],
        },
      ],
      px: [
        {
          px: [
            (value: string) => {
              const keys = ['space', 'size'];
              const isMatched = keys.some((it) => value.includes(it));
              return isMatched;
            },
          ],
        },
      ],
      py: [
        {
          py: [
            (value: string) => {
              const keys = ['space', 'size'];
              const isMatched = keys.some((it) => value.includes(it));
              return isMatched;
            },
          ],
        },
      ],
      'max-w': [
        {
          'max-w': [
            (value: string) => {
              const keys = ['size', 'space'];
              const isMatched = keys.some((it) => value.includes(it));
              return isMatched;
            },
          ],
        },
      ],
      'min-w': [
        (value: string) => {
          const keys = ['space', 'size'];
          const isMatched = keys.some((it) => value.includes(it));
          return isMatched;
        },
      ],
      h: [
        (value: string) => {
          const keys = ['space', 'size'];
          const isMatched = keys.some((it) => value.includes(it));
          return isMatched;
        },
      ],
      'min-h': [
        (value: string) => {
          const keys = ['space', 'size'];
          const isMatched = keys.some((it) => value.includes(it));
          return isMatched;
        },
      ],
    },
  },
});

const cx = (...classes: ClassValue[]) => twMerge1(clsx(...classes));

export default cx;
