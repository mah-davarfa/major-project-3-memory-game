import {useEffect} from 'react';

export default function Modal({title="Modal", onClose, children}){
    useEffect(() => {
        const onKeyDown = (e)=>{
            if(e.key === 'Escape') onClose?.()
        }
         
        document.addEventListener('keydown', onKeyDown)

        const preLockScroll = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return()=>{
            document.removeEventListener('keydown', onKeyDown)
            document.body.style.overflow = preLockScroll;
        }



    }, [onClose])
    
return (
    <div className='modal-overlay'
    onMouseDown={ (e)=> {if(e.target === e.currentTarget) onClose?.() }}
    >
        <div 
        className='modal-panel'
        role="dialog"
        aria-modal="true"
        aria-label={title}
        >
            <div className='modal-header'>
                <h3>{title}</h3>
                <button type="button" 
                className='modal-btn-close'
                 onClick={onClose}
                 aria-label="Close modal"
                 >X</button>
            </div>  

            <div className='modal-content'>
                {children}
            </div>

        </div>

    </div>

    )
}
