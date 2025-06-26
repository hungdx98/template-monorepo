'use client';

import React, { Fragment, useEffect, useRef, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { cx } from '@repo/tailwind-config';
import { Icon } from '../Icon';
import { BackgroundCover } from './BackgroundCover';

export type ModalSizes = 'sm' | 'md' | 'lg' | 'xl' | 'full' | '';

declare global {
  interface Window {
    openModal: (params: ModalParams) => void;
    closeModal: () => void;
    onClose: () => void;
  }
}

export interface ModalParams {
  title?: React.ReactNode;
  content?: React.ReactNode;
  size?: ModalSizes;
  overlayClose?: boolean;
  iconClose?: boolean;
  onClose?: () => void;
}

const modalSizes = {
  sm: 'max-w-[25rem]',
  md: 'max-w-[35rem]',
  lg: 'max-w-[52rem]',
  xl: 'max-w-[78rem]',
  full: 'max-w-[90%] phone:max-w-full',
};

export const Modal = () => {
  // refs
  const initialRef = useRef(null);

  // states
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(
    null,
  );
  const [modalTitle, setModalTitle] = useState<React.ReactNode>('');
  const [modalSize, setModalSize] = useState<ModalSizes>('');
  const [closeable, setClosable] = useState(true);
  const [isClose, setIsClose] = useState(false);

  useEffect(() => {
    window.openModal = openModal;
    window.closeModal = closeModal;
  }, []);

  // functions
  const openModal = ({
    iconClose = false,
    title,
    content,
    size = 'md',
    overlayClose = true,
  }: ModalParams) => {
    if (isOpen) {
      setIsOpen(false);
    }

    setModalTitle(title || '');
    setModalContent(content);
    setIsClose(iconClose);

    setModalSize(size);

    setClosable(overlayClose);
    setIsOpen(true);
  };

  const closeModal = () => {
    closeable && setIsOpen(false);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        initialFocus={initialRef}
        className="relative z-50"
        onClose={closeModal}
      >
        {/* fix initial focus input with key word in docs: Managing initial focus */}
        <div
          ref={initialRef}
          className="opacity-0 pointer-events-none w-0 h-0"
        ></div>
        <Transition.Child
          // as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <BackgroundCover className="fixed" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center backdrop-blur-sm container-modal">
            <Transition.Child
              // as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
              className="w-full"
            >
              <Dialog.Panel
                className={cx(
                  'mx-auto transform overflow-hidden rounded-2xl bg-background-surface px-6 py-8 ipadpro:py-6 ipad:px-4 text-left align-middle shadow-xl transition-all',
                  modalSize && modalSizes[modalSize],
                )}
              >
                {modalTitle && (
                  <Dialog.Title
                    as="h2"
                    className={cx(
                      'mb-8 ipad:mb-4 font-semibold text-center capitalize',
                      isClose && 'flex justify-between items-center gap-2',
                    )}
                  >
                    <span className="truncate text-center">{modalTitle}</span>
                    {isClose && (
                      <Icon
                        className="cursor-pointer"
                        onClick={closeModal}
                        name="close"
                      />
                    )}
                  </Dialog.Title>
                )}
                {modalContent && <div>{modalContent}</div>}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
