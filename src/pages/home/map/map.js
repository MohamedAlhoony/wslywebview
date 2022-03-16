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
                props.locations.length
                    ? {
                          lat: props.locations[props.locations.length - 1].Lat,
                          lng: props.locations[props.locations.length - 1].Lang,
                      }
                    : { lat: 32.8872, lng: 13.1913 }
            }
        >
            {props.locations.map((item, key) => {
                return (
                    <Marker
                        icon={'./images/home.svg'}
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
