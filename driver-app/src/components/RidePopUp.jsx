import React from 'react'
import { getExternalMapsDirBase, getPlaceholderAvatarUrl } from '../config/externalEndpoints'

const RidePopUp = (props) => {
    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                if (typeof props.onDismissPanel === 'function') {
                    props.onDismissPanel()
                } else {
                    props.setRidePopupPanel(false)
                }
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-semibold mb-5'>New Ride Available!</h3>
            <div className='mt-4 flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3'>
                <div className='flex items-center gap-3 '>
                    <img className='h-12 rounded-full object-cover w-12' src={getPlaceholderAvatarUrl()} alt="" />
                    <h2 className='text-lg font-medium'>{props.ride?.user?.name || props.ride?.user?.fullname?.firstname}</h2>
                </div>
                <h5 className='text-lg font-semibold'>{props.ride?.distance ?? '—'} km</h5>
            </div>
            <div className='flex gap-2 justify-between flex-col items-center'>
                <div className='w-full mt-5'>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill"></i>
                        <div>
                            <p className='text-sm -mt-1 text-zinc-300'>{props.ride?.pickupLocation || props.ride?.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div>
                            <p className='text-sm -mt-1 text-zinc-300'>{props.ride?.dropLocation || props.ride?.destination}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line"></i>
                        <div>
                            <h3 className='text-lg font-medium'>₹{props.ride?.price ?? props.ride?.fare} </h3>
                            <p className='text-sm -mt-1 text-zinc-400'>{props.ride?.paymentMethod || 'Cash'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-5 px-3 pb-3">
                        <i className="ri-navigation-line" />
                        <button
                            type="button"
                            className="text-sm text-emerald-700 underline"
                            onClick={() => {
                                const pickup = props.ride?.pickupLocation || props.ride?.pickup;
                                if (!pickup) return;
                                const mapsUrl = `${getExternalMapsDirBase()}/?api=1&destination=${encodeURIComponent(pickup)}`;
                                window.open(mapsUrl, '_blank');
                            }}
                        >
                            Open navigation to pickup
                        </button>
                    </div>
                </div>
                <div className='mt-5 w-full '>
                    <button type="button" onClick={() => props.confirmRide && props.confirmRide()} className='driver-primary w-full'>Accept</button>

                    <button type="button" onClick={() => props.onReject ? props.onReject() : props.setRidePopupPanel(false)} className='driver-danger mt-2 w-full'>Reject</button>


                </div>
            </div>
        </div>
    )
}

export default RidePopUp