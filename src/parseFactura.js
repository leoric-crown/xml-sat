import moment from 'moment'
import decode from 'decode-html'
import XMLParser from 'react-xml-parser'

const xmlParser = new XMLParser()

function parseConceptos(conceptos) {

    const concepts = []
    conceptos.children.forEach(con => {
        if (con.name === 'cfdi:Concepto') {
            const { attributes, children } = con

            const impuestos = children.find(obj => obj.name === 'cfdi:Impuestos')
            const traslados = impuestos ? impuestos.children.find(obj => obj.name === 'cfdi:Traslados') : null
            const ivaAttributes = traslados ?
                traslados.children.find(obj => {
                    return obj.name === 'cfdi:Traslado' && obj.attributes.Impuesto === '002'
                }).attributes : null
            const details = {
                subtotal: ivaAttributes ? ivaAttributes.Base : 0,
                iva: ivaAttributes ? ivaAttributes.Importe : 0
            }

            concepts.push({
                description: attributes.Descripcion,
                unitprice: attributes.ValorUnitario,
                quantity: attributes.Cantidad,
                unit: attributes.ClaveUnidad,
                price: attributes.Importe,
                details
            })
        }
    })

    return concepts
}

function parseFactura(results) {
    const jsonFactura = []
    results.forEach(xml => {
        const jsonParse = xmlParser.parseFromString(xml)
        const { attributes, children } = jsonParse
        const { SubTotal, Total, Fecha } = attributes
        const fecha = moment(Fecha).format('DD/MM/YYYY h:mm:ss a')
        const emisorXml = children.find(obj => {
            return obj.name === 'cfdi:Emisor'
        })
        const emisor = decode(emisorXml.attributes.Nombre)
        const rfc = emisorXml.attributes.Rfc
        const impuestos = children.find(obj => {
            return obj.name === 'cfdi:Impuestos'
        })
        var traslados
        if (impuestos) {
            traslados = impuestos.children.find(obj => obj.name === 'cfdi:Traslados')
            if (traslados) {
                const iva = traslados.children.find(obj => {
                    return obj.name === 'cfdi:Traslado' && obj.attributes.Impuesto === '002'
                })
                if (iva) traslados.iva = iva.attributes.Importe
            }
        }
        var efecto = ''
        switch (attributes.TipoDeComprobante) {
            case 'I':
                efecto = 'Ingreso'
                break
            case 'E':
                efecto = 'Egreso'
                break
            default:
                efecto = 'N/A'
                break
        }

        const conceptos = children.find(obj => {
            return obj.name === "cfdi:Conceptos"
        })


        const json = {
            total: Total,
            subtotal: SubTotal,
            fecha,
            emisor,
            rfc,
            efecto,
            ivaTrasladado: traslados && traslados.iva ? traslados.iva : 0,
            conceptos: parseConceptos(conceptos)
        }
        jsonFactura.push(json)
    })
    return jsonFactura
}

export default parseFactura