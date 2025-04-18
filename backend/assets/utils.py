from math import radians, cos, sin, asin, sqrt

def haversine(lon1, lat1, lon2, lat2):
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees)
    """
    # convert decimal degrees to radians 
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])

    # haversine formula 
    dlon = lon2 - lon1 
    dlat = lat2 - lat1 
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a)) 
    r = 6371000 # Radius of earth in meters. Use 3956 for miles
    return c * r

def verificar_coordenada_dentro(lonC, latC, lonT, latT):    
    print(lonC)
    print(latC)
    print(lonT)
    print(latT)
    
    if (lonC is None or latC is None): 
        return True
    
    a = haversine(lonC, latC, lonT, latT)
    print(a)
    radius = 100
    
    # print('Distance (m) : ', a)
    return a <= radius