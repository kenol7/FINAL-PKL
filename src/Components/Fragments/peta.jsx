
import {
    APIProvider,
    Map,
    AdvancedMarker,
} from '@vis.gl/react-google-maps';

const Peta = (props) => {
    const position = { lat: props.latitude, lng: props.longitude };
    return (
        <div style={{ width: props.lebar, height: props.tinggi }}>
            <APIProvider apiKey="AIzaSyDtRAmlhx3Ada5pVl5ilzeHP67TLxO6pyo">
                <Map defaultCenter={position} defaultZoom={props.zoom} mapId={props.mapid}>
                    <AdvancedMarker position={position} title={props.teks} />
                </Map>
            </APIProvider>
        </div>
    )

};

export default Peta;