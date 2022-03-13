import React from 'react'
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
} from 'react-google-maps'
import { Icon } from 'semantic-ui-react'

const handleMarkerClick = (props, item, marker, key) => {
    props.handleMarkerClick(item, marker, key)
}
const svgMarkerSelected = {
    path: 'M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z',
    fillColor: 'yellow',
    fillOpacity: 0.6,
    strokeWeight: 0,
    rotation: 0,
    scale: 2,
}
const svgMarker = {
    path: 'M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z',
    fillColor: 'red',
    fillOpacity: 0.6,
    strokeWeight: 0,
    rotation: 0,
    scale: 2,
}
const MyMapComponent = withScriptjs(
    withGoogleMap((props) => (
        <GoogleMap
            onClick={(marker) => {
                props.onMapClick(marker)
            }}
            defaultZoom={8}
            defaultCenter={{ lat: 32.8872, lng: 13.1913 }}
        >
            {props.locations.map((item, key) => {
                return (
                    <Marker
                        icon={item.isSelected ? svgMarkerSelected : svgMarker}
                        zIndex={item.isSelected ? 1000 : 1}
                        title={item.isSelected ? 'تم الاختيار' : 'مكان سابق'}
                        label={item.isSelected ? 'تم الاختيار' : ''}
                        labelStyle={{ fontWeight: 'bolder' }}
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
