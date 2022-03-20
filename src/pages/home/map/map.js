import React from 'react'
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
} from 'react-google-maps'
const handleMarkerClick = (props, item, marker, key) => {
    props.handleMarkerClick(item, marker, key)
}

const MyMapComponent = withScriptjs(
    withGoogleMap((props) => (
        <GoogleMap
            onClick={(marker) => {
                props.onMapClick(marker)
            }}
            defaultZoom={props.locations.length ? 15 : 9}
            defaultCenter={
                props.store.lat && props.store.lang
                    ? { lat: props.store.lat, lng: props.store.lang }
                    : { lat: 32.8872, lng: 13.1913 }
            }
        >
            {props.store.lat && props.store.lang && (
                <Marker
                    zIndex={1000}
                    icon={'./images/store.svg'}
                    position={{ lat: props.store.lat, lng: props.store.lang }}
                />
            )}
            {props.locations.map((item, key) => {
                return (
                    <Marker
                        icon={
                            item.isSelected
                                ? './images/home selected.svg'
                                : './images/home.svg'
                        }
                        zIndex={item.isSelected ? 1000 : 1}
                        key={key}
                        position={{ lat: item.Lat, lng: item.Lang }}
                        onClick={(marker) =>
                            handleMarkerClick(props, item, marker, key)
                        }
                    />
                )
            })}
        </GoogleMap>
    ))
)

const map = (props) => {
    return (
        <MyMapComponent
            {...props}
            isMarkerShown
            googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `400px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
        />
    )
}

export default map
